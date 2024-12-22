"use client";

import { ChevronDownIcon, PlusIcon, SearchIcon, VerticalDotsIcon } from "@/components/icons";
import { useGetProjectData } from "@/hooks/getProjectData";
import { projectInfoToSensibleTypes } from "@/utils/project";
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
import React from "react";
import { WalletUser } from "./user";
import { useDisclosure } from "@nextui-org/modal";
import { CreateContractModal } from "./create-project";

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
  "active"
];

// type User = (typeof projects)[0];

export default function BaseTable(props: { onCreateNew: () => void }) {
  const projects = useGetProjectData() || [];
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [ownerFilter, setOwnerFilter] = React.useState(false);
  console.log(ownerFilter)
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(projects.length / rowsPerPage);

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
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredUsers = filteredUsers.filter((user) =>
    //     Array.from(statusFilter).includes(user.status),
    //   );
    // }

    return filteredUsers;
  }, [projects, filterValue, statusFilter]);

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
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "owner":
        return (
          <WalletUser key={user.owner} address={user.owner} />
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
                <DropdownItem key="view">View</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem key="delete">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
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
            <Button
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
              </Button>
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
          <span className="text-default-400 text-small">Total {projects.length} users</span>
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
  ]);

  const bottomContent = React.useMemo(() => {
    return (
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
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

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
      bottomContent={bottomContent}
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
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}


export function ProjectTableWithStartModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <CreateContractModal isOpen={isOpen} onClose={onClose} />
      <BaseTable onCreateNew={onOpen} />
    </>
  );
}