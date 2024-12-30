"use client";

import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import { Pagination } from "@nextui-org/pagination";
import {
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { User } from "@nextui-org/user";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/modal";
import { Tooltip } from "@nextui-org/tooltip";
import { useAccount } from "wagmi";
import { neon } from "@neondatabase/serverless";
import { Spinner } from "@nextui-org/spinner";

import { WalletUser, WalletUsersScrollable } from "../user";
import { CreateContractModal } from "../create-project";
import { StartProjectForm } from "../start-project";
import { useGetContributorsOrValidators } from "../../hooks/useGetContributorsOrValidators";

import { OwnerButton } from "./ownerButton";

import { SQLContext } from "@/app/providers";
import {
  appendContributors,
  appendValidators,
  POSTGRES_URL,
  TABLE_NAME,
} from "@/app/postgres";
import { canStartProject, projectInfoToSensibleTypes } from "@/utils/project";
import { useGetProjectData } from "@/hooks/getProjectData";
import {
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import { useCommitValidations } from "@/hooks/useCommitValidations";
import { CONTRIBUTOR_NAME, OWNER_NAME, VALIDATOR_NAME } from "@/config/site";

type User = ReturnType<typeof projectInfoToSensibleTypes>;

// active: Boolean(project.active),
// contributorRewardAmount: Number(project.contributorRewardAmount),
// validatorRewardAmount: Number(project.validatorRewardAmount),
// validationCommitmentDeadline: new Date(Number(project.validationCommitmentDeadline)),
// validationRevealDeadline: new Date(Number(project.validationRevealDeadline)),
// numContributors: Number(project.numContributors),
// numValidators: Number(project.numValidators),
// totalScore: Number(project.totalScore),
// totalSuccessfulValidations: Number(project.totalSuccessfulValidations),
// projectId,

export const columns = [
  { name: "ID", uid: "projectId", sortable: true },
  { name: OWNER_NAME.toUpperCase(), uid: "owner", sortable: true },
  { name: "PROJECT NAME", uid: "name", sortable: true },
  {
    name: CONTRIBUTOR_NAME.toUpperCase() + "S",
    uid: "numContributors",
    sortable: true,
  },
  {
    name: VALIDATOR_NAME.toUpperCase() + "S",
    uid: "numValidators",
    sortable: true,
  },
  { name: "STATUS", uid: "active", sortable: true },
  { name: "ACTIONS", uid: "actions" },
  // {name: "ID", uid: "id", sortable: true},
  // // {name: "NAME", uid: "name", sortable: true},
  // {name: "AGE", uid: "age", sortable: true},
  // {name: "ROLE", uid: "role", sortable: true},
  // {name: "TEAM", uid: "team"},
  // {name: "EMAIL", uid: "email"},
  // {name: "STATUS", uid: "status", sortable: true},
  // {name: "ACTIONS", uid: "actions"},
];

export const statusOptions = [
  { name: "Active", uid: "active", active: true },
  { name: "Not Started", uid: "inactive", active: false },
  // { name: "Vacation", uid: "vacation" },
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

// const statusColorMap: Record<string, ChipProps["color"]> = {
//   active: "success",
//   paused: "danger",
//   vacation: "warning",
// };

const INITIAL_VISIBLE_COLUMNS = [
  // "projectId",
  "owner",
  "name",
  "numContributors",
  "numValidators",
  "active",
  "actions",
];

// type User = (typeof projects)[0];

// export function useGetProjectDataByOwner(props: { owner: string }) {
//   const projects = useGetProjectData() || [];

//   return projects.filter((project) => project.owner === props.owner);

// }

export function Scrollable(props: {
  projectId: number;
  num: number;
  fn: "getContributor" | "getValidator";
}) {
  const res = useGetContributorsOrValidators(props);

  return (
    <WalletUsersScrollable
      addresses={
        res.data
          ?.map((res) => res.result)
          .filter((res) => typeof res === "string") || []
      }
      project={props.projectId.toString()}
      type={props.fn}
    />
  );
}

export default function BaseTable(props: {
  onCreateNew: () => void;
  onStartProject: (
    projectId: ReturnType<typeof projectInfoToSensibleTypes>,
  ) => void;
  onSubmitValidation: (
    projectId: ReturnType<typeof projectInfoToSensibleTypes>,
  ) => void;
}) {
  const projectsRaw = useGetProjectData();
  const projects = projectsRaw || [];
  const projectIds = projects.map((p) => p.projectId).join(",");
  const sql = useContext(SQLContext)[0];

  useEffect(() => {
    const ids = projects.map((p) => p.projectId);

    const idOwnerMap = projects.reduce(
      (acc, project) => {
        acc[project.projectId] = project.owner;

        return acc;
      },
      {} as Record<number, string>,
    );

    const idNameMap = projects.reduce(
      (acc, project) => {
        acc[project.projectId] = project.name;

        return acc;
      },
      {} as Record<number, string>,
    );

    if (sql) {
      const sqlIds = sql.map((p: Record<string, any>) => p.project);
      const inactiveIds = projects
        .filter((p) => !p.active)
        .map((p) => p.projectId);

      const missingIds = inactiveIds.filter((id) => !sqlIds.includes(id));
      const unwantedIds = sqlIds.filter((id) => !inactiveIds.includes(id));

      // const missingIds = ids.filter((id) => !sqlIds.includes(id));

      if (missingIds.length > 0 || (projectsRaw && unwantedIds.length > 0)) {
        const db = neon(POSTGRES_URL);

        const transactions = missingIds.map((id) =>
          db(
            `INSERT INTO ${TABLE_NAME} (project, owner, name, contributors, validators) VALUES ($1, $2, $3, $4, $5)`,
            [id, idOwnerMap[id], idNameMap[id], "", ""],
          ),
        );

        if (projectsRaw && unwantedIds.length > 0) {
          transactions.push(
            db(
              `DELETE FROM ${TABLE_NAME} WHERE project IN (${unwantedIds.join(",")})`,
            ),
          );
        }

        db.transaction(transactions)
          .then((...data) => console.log("insertions complete", data))
          .catch((e) => console.error("insertions failed", e));

        // missingIds.map(async (id) => {
        //   sql(`INSERT INTO projects (project, owner, contributors, validators) VALUES ($1, $2, $3, $4)`, [id, "0x1", "0x2,0x3", "0x4"]);
        // });
      }

      // console.log('missing ids', missingIds);

      // missingIds.forEach(async (id) => {
      //   await sql(`INSERT INTO ${TABLE_NAME} (project, owner, contributors, validators) VALUES ($1, $2, $3, $4)`, [id, "0x1", "0x2,0x3", "0x4"]);
      // });
    }

    // const sqlIds = (sql || []).map((p: Record<string, any>) => p.project);

    // await sql(`INSERT INTO ${TABLE_NAME} (project, owner, contributors, validators) VALUES ($1, $2, $3, $4)`, [1, "0x1", "0x2,0x3", "0x4"]);

    // create a row for each project id that is not in the database
  }, [projects.map((p) => p.projectId).join(","), sql]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [ownerFilter, setOwnerFilter] = React.useState(false);
  // console.log(ownerFilter)
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const account = useAccount();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...projects];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (ownerFilter) {
      filteredUsers = filteredUsers.filter(
        (user) => user.owner === account.address,
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      console.log("statusFilter", statusFilter);
      filteredUsers = filteredUsers.filter(
        (user) =>
          (statusFilter.has("active") && user.active) ||
          (statusFilter.has("inactive") && !user.active),
      );
    }

    return filteredUsers.map((user) => ({
      ...user,
      isOwner: user.owner === account.address,
      currentAddress: account.address,
    }));
  }, [projects, filterValue, statusFilter, ownerFilter, account.address]);

  const pages = Math.max(Math.ceil(filteredItems.length / rowsPerPage), 1);

  useEffect(() => {
    if (page > pages && page !== 1) {
      setPage(1);
    }
  }, [pages]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number;
      const second = b[sortDescriptor.column as keyof User] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items, account.address]);

  const renderCell = useCallback(
    (
      user: User & { isOwner: boolean; currentAddress: string },
      columnKey: React.Key,
    ) => {
      const cellValue = user[columnKey as keyof User];

      switch (columnKey) {
        case "numValidators":
        case "numContributors":
          // case "totalScore":
          return (
            <Tooltip
              className="text-center"
              content={
                <Scrollable
                  fn={
                    columnKey === "numContributors"
                      ? "getContributor"
                      : "getValidator"
                  }
                  num={cellValue as number}
                  projectId={user.projectId}
                />
              }
              delay={1}
              isDisabled={cellValue === 0}
            >
              {cellValue as number}
            </Tooltip>
          );
        case "owner":
          return (
            <WalletUser
              key={"project-display" + "-" + user.projectId + "-" + user.owner}
              address={user.owner}
            />
          );
        // case "role":
        //   return (
        //     <div className="flex flex-col">
        //       <p className="text-bold text-small capitalize">{cellValue}</p>
        //       <p className="text-bold text-tiny capitalize text-default-500">{user.team}</p>
        //     </div>
        //   );
        case "active":
          // TODO: Support finished state
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={user.active ? "success" : "warning"}
              size="sm"
              variant="dot"
            >
              {user.active ? "active" : "not started"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {/* <DropdownItem key={"addr"}>{user.currentAddress}</DropdownItem> */}
                  {user.isOwner && !user.active && canStartProject(user) ? (
                    <DropdownItem
                      key="start"
                      onPress={() => props.onStartProject(user)}
                    >
                      Start Project
                    </DropdownItem>
                  ) : (
                    <></>
                  )}
                  {!user.isOwner &&
                  !user.active &&
                  !user.isContributor &&
                  !user.isValidator ? (
                    <DropdownItem
                      key="contribJoin"
                      onPress={() => {
                        // const db = neon(POSTGRES_URL);

                        if (user.currentAddress) {
                          appendContributors(
                            user.projectId,
                            user.currentAddress,
                          );
                          alert("Contributor request sent");
                        }
                      }}
                    >
                      Join as {CONTRIBUTOR_NAME}
                    </DropdownItem>
                  ) : (
                    <></>
                  )}
                  {!user.isOwner &&
                  !user.active &&
                  !user.isContributor &&
                  !user.isValidator ? (
                    <DropdownItem
                      key="valJoin"
                      onPress={() => {
                        if (user.currentAddress) {
                          appendValidators(user.projectId, user.currentAddress);
                          alert("Validator request sent");
                        }

                        // alert("Validator request sent");
                      }}
                    >
                      Join as {VALIDATOR_NAME}
                    </DropdownItem>
                  ) : (
                    <></>
                  )}

                  {user.isValidator && user.active ? (
                    <DropdownItem
                      key="submitValidations"
                      onPress={() => props.onSubmitValidation(user)}
                    >
                      Submit {VALIDATOR_NAME} Scores
                    </DropdownItem>
                  ) : (
                    <></>
                  )}
                  {/* <DropdownItem key="delete">Delete</DropdownItem> */}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          // TODO: Remve this misleading typecasting
          return cellValue as string | number | boolean;
      }
    },
    [],
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  // const onOwnerFilterChange = React.useCallback((value?: boolean) => {
  //   if (value) {
  //     setOwnerFilter(value);
  //     setPage(1);
  //   } else {
  //     setOwnerFilter(value);
  //   }
  // });

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <OwnerButton isChecked={ownerFilter} onChange={setOwnerFilter} />
            {/* <Button
                  onPress={() => {
                    console.log('ownerFilter', ownerFilter)
                    setOwnerFilter(!ownerFilter)

                  }}
                  className="mr-0 pr-0"
                  endContent={<Checkbox 
                    title="Owned"
                    className="m-0 p-0"
                    isSelected={ownerFilter}
                    onChange={() => setOwnerFilter(!ownerFilter)}
                  />}
                  size="sm"
                  variant="flat"
                >
                  Owner
              </Button> */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-foreground text-background"
              endContent={<PlusIcon />}
              size="sm"
              onPress={props.onCreateNew}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} projects
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    projects.length,
    hasSearchFilter,
    ownerFilter,
    account.address,
  ]);

  // const bottomContent = React.useMemo(() => {
  //   return (
  //     <div className="py-2 px-2 flex justify-between items-center">
  //       <Pagination
  //         showControls
  //         classNames={{
  //           cursor: "bg-foreground text-background",
  //         }}
  //         color="default"
  //         isDisabled={hasSearchFilter}
  //         page={page}
  //         total={pages}
  //         variant="light"
  //         onChange={setPage}
  //       />
  //       <span className="text-small text-default-400">
  //         {selectedKeys === "all"
  //           ? "All items selected"
  //           : `${selectedKeys.size} of ${items.length} selected`}
  //       </span>
  //     </div>
  //   );
  // }, [selectedKeys, items.length, page, pages, hasSearchFilter, account.address]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        // middle
        "group-data-[middle=true]/tr:before:rounded-none",
        // last
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <Table
      // isCompact
      hoverable
      removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={
        <div className="py-2 px-2 flex justify-between items-center">
          <Pagination
            showControls
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            color="default"
            isDisabled={hasSearchFilter}
            page={page}
            total={pages}
            variant="light"
            onChange={setPage}
          />
        </div>
      }
      bottomContentPlacement="outside"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background",
        },
      }}
      classNames={classNames}
      selectedKeys={selectedKeys}
      selectionMode="single"
      // TODO: Fix error resulting from multiple instances of the types library being present
      // @ts-ignore
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No projects found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.projectId}>
            {(columnKey) => (
              <TableCell>{renderCell(item as any, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

const SubmitValidationsForm = (props: {
  project: ReturnType<typeof projectInfoToSensibleTypes>;
  onClose: () => void;
}) => {
  const contributors = useGetContributorsOrValidators({
    projectId: props.project.projectId,
    fn: "getContributor",
    num: props.project.numContributors,
  });

  const loadedContributors = useMemo(() => {
    return (
      contributors.data
        ?.filter((wallet) => wallet.status === "success")
        .map((wallet) => wallet.result) || []
    );
  }, [contributors.data]);

  const [scoers, setScores] = useState<Record<string, number>>({});

  const {
    commitValidations,
    isPending,
    status,
    isSuccess,
    receiptStatus,
    reset,
  } = useCommitValidations();

  useEffect(() => {
    setScores({});
  }, [loadedContributors, props.project]);

  useEffect(() => {
    if (receiptStatus === "success") {
      props.onClose();
      reset();
    }
    if (receiptStatus === "error" || status === "error") {
      alert("Error submitting validations");
      reset();
    }
  }, [status, receiptStatus]);

  console.log(status, receiptStatus);

  if (isPending || (isSuccess && receiptStatus === "pending")) {
    return (
      <Spinner
        className="bg-opacity-0 border-opacity-0"
        color="warning"
        label="Submitting Validations ..."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button isDisabled color="secondary">
        Submit validations for
        <b>{props.project.name}</b>
      </Button>
      <Table
        // disallowEmptySelection
        aria-label="Example static collection table"
        color={"primary"}
        // selectedKeys={keys}
        selectionMode="none"
        // onSelectionChange={(keys) => setKeys(keys)}
        // onChange={(keys) => setKeys(keys)}
      >
        <TableHeader>
          <TableColumn>Wallet</TableColumn>
          <TableColumn>Score</TableColumn>
          {/* <TableColumn>ROLE</TableColumn>
              <TableColumn>STATUS</TableColumn> */}
        </TableHeader>
        <TableBody>
          {loadedContributors?.map((wallet, i) => (
            <TableRow key={i + wallet}>
              <TableCell>
                <WalletUser address={wallet as `0x${string}`} />
              </TableCell>
              <TableCell>
                <Input
                  max={100}
                  min={0}
                  type="number"
                  value={scoers["wallet"]?.toString()}
                  onChange={(e) => {
                    setScores({
                      ...scoers,
                      [wallet]: Number(e.target.value),
                    });
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <span className="flex">
        <Button
          className="w-full"
          color="primary"
          onPress={() => {
            commitValidations(props.project.projectId, scoers);
            // console.log(scoers);
            // props.onClose();
          }}
          // isDisabled={isPending || wallets.length === 0}
          // onPress={() => {
          //   if (type === "Contributors") clearContributors(projectId);
          //   else clearValidators(projectId);

          //   reset();
          // }}
        >
          Submit
        </Button>
      </span>
    </div>
  );
};

export function ProjectTableWithStartModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const startFormModal = useDisclosure();
  const submitValidationsmodal = useDisclosure();
  const [project, setProject] =
    React.useState<ReturnType<typeof projectInfoToSensibleTypes>>();

  return (
    <>
      <CreateContractModal isOpen={isOpen} onClose={onClose} />

      <BaseTable
        onCreateNew={onOpen}
        onStartProject={(_project) => {
          setProject(_project);
          startFormModal.onOpen();
        }}
        onSubmitValidation={(_project) => {
          setProject(_project);
          submitValidationsmodal.onOpen();
        }}
      />

      <Modal
        hideCloseButton
        backdrop={"blur"}
        isOpen={startFormModal.isOpen}
        onClose={startFormModal.onClose}
      >
        <ModalContent>
          {typeof project?.projectId === "number" ? (
            <StartProjectForm
              projectId={project.projectId}
              onClose={startFormModal.onClose}
            />
          ) : undefined}
        </ModalContent>
      </Modal>

      <Modal
        hideCloseButton
        backdrop={"blur"}
        isOpen={submitValidationsmodal.isOpen}
        size="2xl"
        onClose={submitValidationsmodal.onClose}
      >
        <ModalContent>
          {typeof project?.projectId === "number" ? (
            <SubmitValidationsForm
              project={project}
              onClose={submitValidationsmodal.onClose}
            />
          ) : undefined}
        </ModalContent>
      </Modal>
    </>
  );
}
