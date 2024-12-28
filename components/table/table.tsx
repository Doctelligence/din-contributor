"use client";

import { ChevronDownIcon, PlusIcon, SearchIcon, VerticalDotsIcon } from "@/components/icons";
import { useGetProjectData } from "@/hooks/getProjectData";
import { canStartProject, projectInfoToSensibleTypes } from "@/utils/project";
import { Button } from "@nextui-org/button";
import { Chip, ChipProps } from "@nextui-org/chip";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Checkbox } from "@nextui-org/checkbox";
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
import React, { use, useCallback, useContext, useEffect } from "react";
import { WalletUser, WalletUsersScrollable } from "../user";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/modal";
import { Tooltip } from "@nextui-org/tooltip";
import { CreateContractButton, CreateContractModal } from "../create-project";
import { StartProjectForm, StartProjectPage } from "../start-project";
import { OwnerButton } from "./ownerButton";
import { useAccount, useReadContracts } from "wagmi";
import { SQLContext } from "@/app/providers";
import   { neon } from "@neondatabase/serverless"
import { appendContributors, appendValidators, POSTGRES_URL, TABLE_NAME,  } from "@/app/postgres";
import { TABLE_VERSIONS } from "@/config/site";
import { ac } from "@upstash/redis/zmscore-Dc6Llqgr";
import abi from "@/contract/abi";
import { CONTRACT_ADDRESS } from "@/contract/config";

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
  {name: "ID", uid: "projectId", sortable: true},
  {name: "OWNER", uid: "owner", sortable: true},
  {name: "NAME", uid: "name", sortable: true},
  {name: "CONTRIBUTORS", uid: "numContributors", sortable: true},
  {name: "VALIDATORS", uid: "numValidators", sortable: true},
  {name: "STATUS", uid: "active", sortable: true},
  {name: "ACTIONS", uid: "actions"},
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
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
  {name: "Vacation", uid: "vacation"},
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
  "projectId",
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

export function Scrollable(props: { projectId: number; num: number; fn: 'getContributor' | 'getValidator' }) {
  const res = useReadContracts({
    contracts: new Array(props.num).fill(undefined).map((_, i) => ({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: props.fn as 'getContributor' | 'getValidator',
      args: [BigInt(props.projectId), BigInt(i)],
    })),
  });

  return (
    <WalletUsersScrollable project={props.projectId.toString()} type={props.fn} addresses={res.data?.map(res => res.result).filter(res => typeof res === 'string') || []} />
  )
}

export default function BaseTable(props: { onCreateNew: () => void; onStartProject: (projectId: number) => void }) {
  const projects = useGetProjectData() || [];
  const projectIds = projects.map(p => p.projectId).join(',');
  const sql = useContext(SQLContext)[0];

  useEffect(() => {
    const ids = projects.map(p => p.projectId);

    const idOwnerMap = projects.reduce((acc, project) => {
      acc[project.projectId] = project.owner;
      return acc;
    }
    , {} as Record<number, string>);

    const idNameMap = projects.reduce((acc, project) => {
      acc[project.projectId] = project.name;
      return acc;
    }
    , {} as Record<number, string>);

    if (sql) {
      const sqlIds = sql.map((p: Record<string, any>) => p.project);
      const missingIds = ids.filter(id => !sqlIds.includes(id));

      if (missingIds.length) {
        const db = neon(POSTGRES_URL);
        db.transaction(missingIds.map(id => db(`INSERT INTO ${TABLE_NAME} (project, owner, name, contributors, validators) VALUES ($1, $2, $3, $4, $5)`, [id, idOwnerMap[id], idNameMap[id], "", ""])))
          .then((...data) => console.log('insertions complete', data))
          .catch((e) => console.error('insertions failed', e));
        
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

  }, [projects.map(p => p.projectId).join(','), sql]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
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

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...projects];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (ownerFilter) {
      filteredUsers = filteredUsers.filter((user) => user.owner === account.address);
    }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredUsers = filteredUsers.filter((user) =>
    //     Array.from(statusFilter).includes(user.status),
    //   );
    // }

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

  const renderCell = useCallback((user: User & { isOwner: boolean; currentAddress: string }, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "numValidators":
      case "numContributors":
      // case "totalScore":
        return <Tooltip delay={1} isDisabled={cellValue === 0} content={
          <Scrollable projectId={user.projectId} num={cellValue as number} fn={columnKey === 'numContributors' ? 'getContributor' : 'getValidator'} />
        } className="text-center">{cellValue as number}</Tooltip>;
      case "owner":
        return (
          <WalletUser key={'project-display' + '-' + user.projectId + '-' + user.owner} address={user.owner} />
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
                {(user.isOwner && canStartProject(user)) ? <DropdownItem onPress={() => props.onStartProject(user.projectId)} key="start">Start Project</DropdownItem> : <></>}
                {!user.isOwner ? <DropdownItem key="view" onPress={() => {
                  // const db = neon(POSTGRES_URL);

                  if (user.currentAddress) {
                    appendContributors(user.projectId, user.currentAddress);
                    alert('Contributor request sent');
                  }

                }}>Join as contributor</DropdownItem> : <></>}
                {!user.isOwner ? <DropdownItem key="edit" onPress={() => {

                if (user.currentAddress) {
                  appendValidators(user.projectId, user.currentAddress);
                  alert('Contributor request sent');
                }

                  alert('Validator request sent');
                }}>Join as validator</DropdownItem> : <></>}
                {/* <DropdownItem key="delete">Delete</DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        // TODO: Remve this misleading typecasting
        return cellValue as string | number | boolean;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

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
            <Button className="bg-foreground text-background" endContent={<PlusIcon />} size="sm" onPress={props.onCreateNew}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {filteredItems.length} projects</span>
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
      hoverable
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
            {(columnKey) => <TableCell>{renderCell(item as any, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export function ProjectTableWithStartModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const startFormModal = useDisclosure();
  const [projectId, setProjectId] = React.useState<number>();

  return (
    <>
      <CreateContractModal isOpen={isOpen} onClose={onClose} />
      
      <BaseTable onCreateNew={onOpen} onStartProject={_projectId => {
        setProjectId(_projectId);
        startFormModal.onOpen();
      }} />

      <Modal hideCloseButton backdrop={"blur"} isOpen={startFormModal.isOpen} onClose={startFormModal.onClose}>
        <ModalContent >
          {typeof projectId === 'number' ? <StartProjectForm onClose={startFormModal.onClose} projectId={projectId} /> : undefined}
        </ModalContent>
      </Modal>
    </>
  );
}