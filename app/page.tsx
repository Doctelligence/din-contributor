"use client";

import { Checkbox } from "@nextui-org/checkbox";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import React from "react";
import { Button } from "@nextui-org/button";
import { Alert } from "@nextui-org/alert";

import { SQLContext } from "./providers";
import {
  clearContributors,
  clearContributorsOrValidators,
  clearValidators,
  sanatise,
} from "./postgres";

import { useAddValidatorsOrContributors } from "@/hooks/addContributor";
import { ProjectTableWithStartModal } from "@/components/table/table";
import { WalletUser } from "@/components/user";

function ContributorsAndValidatorsManager({
  wallets,
  title,
  projectId,
  type,
}: {
  wallets: `0x${string}`[];
  title: string;
  projectId: number;
  type: "Contributors" | "Validators";
}) {
  const { add, isPending, isSuccess, ...args } =
    useAddValidatorsOrContributors();
  const [keys, setKeys] = useState<Set<number | string> | "all">(
    new Set<number | string>(),
  );
  const reset = useContext(SQLContext)[1];

  useEffect(() => {
    if (isSuccess) {
      clearContributorsOrValidators(projectId, type);
      reset();
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col gap-3">
      <Button isDisabled color="secondary">
        {type.slice(0, -1) + " requests for"}
        <b>{title}</b>
      </Button>
      <Table
        // disallowEmptySelection
        aria-label="Example static collection table"
        color={"primary"}
        selectedKeys={keys}
        selectionMode="multiple"
        onSelectionChange={(keys) => setKeys(keys)}
        // onChange={(keys) => setKeys(keys)}
      >
        <TableHeader>
          <TableColumn>Wallet</TableColumn>
          {/* <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn> */}
        </TableHeader>
        <TableBody>
          {wallets.map((wallet, i) => (
            <TableRow key={i}>
              <TableCell>
                <WalletUser address={wallet as `0x${string}`} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <span className="flex">
        <Button
          className="w-5/12"
          color="warning"
          isDisabled={isPending || wallets.length === 0}
          onPress={() => {
            if (type === "Contributors") clearContributors(projectId);
            else clearValidators(projectId);

            reset();
          }}
        >
          Add None
        </Button>
        <Button
          className="w-5/12 ml-auto"
          color="success"
          isDisabled={
            isPending ||
            wallets.length === 0 ||
            (typeof keys === "object" && keys.size === 0)
          }
          onPress={() => {
            add(type, [
              BigInt(projectId),
              keys === "all"
                ? wallets
                : wallets.filter((_, i) => keys.has(i) || keys.has(`${i}`)),
            ]);
            setKeys(new Set());
          }}
        >
          Add {type}
        </Button>
      </span>
    </div>
  );
}

function DisplayColumn(
  props:
    | { columnKey: "name"; value: string; onChange: () => void }
    | { columnKey: "wallet"; value: `0x${string}`; onChange: () => void }
    | { columnKey: "enabled"; value: boolean; onChange: () => void },
) {
  switch (props.columnKey) {
    case "wallet":
      return <WalletUser address={props.value} />;
    case "name":
      return props.value;
    case "enabled":
      return (
        <Checkbox
          className="p-5"
          isSelected={props.value}
          onChange={props.onChange}
        />
      );
  }
}

function WalletUserTable({
  wallets,
  title,
}: {
  wallets: string[];
  title: string;
}) {
  // const [checked, setChecked] = useState(false);
  const [items, setItems] = useState(() =>
    wallets.map((wallet) => ({ wallet, enabled: true })),
  );

  useEffect(() => {
    setItems(wallets.map((wallet) => ({ wallet, enabled: true })));
  }, [wallets]);

  return (
    <Table title="Wallets">
      <TableHeader
        columns={[
          { name: "Account", uid: "wallet", sortable: true },
          // {name: "Project Name", uid: "name", sortable: true},
          { name: "Enabled", uid: "enabled", sortable: true },
        ]}
      >
        {(elem) => <TableColumn key={elem.uid}>{elem.name}</TableColumn>}
      </TableHeader>
      <TableBody
        emptyContent={"No projects found"}
        items={
          // [{ projectId: 1, owner: "hello", wallet: "0xb17431E497dd0289e076dAF827C036ea90e17cDb", name: "hello", enabled: true }]
          items
        }
      >
        {(item) => (
          <TableRow key={item.wallet}>
            {/* @ts-ignore */}
            {(columnKey: "wallet" | "enabled") => (
              <TableCell>
                {/* @ts-ignore */}
                {DisplayColumn({
                  columnKey,
                  value: item[columnKey],
                  onChange: () => {
                    setItems(
                      items.map((i) =>
                        i.wallet === item.wallet
                          ? { ...i, enabled: !i.enabled }
                          : i,
                      ),
                    );
                  },
                })}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function useGetAll() {
  const address = useAccount();
  const sql = useContext(SQLContext)[0] || [];
  const contributors = useMemo(
    () =>
      sql
        .filter(
          (project: Record<string, any>) =>
            project.owner === address.address &&
            sanatise(project.contributors).length > 0,
        )
        .map((project) => ({
          project: project.project,
          party: sanatise(project.contributors),
          name: project.name,
          type: "Contributors",
        }))
        .toSorted((a, b) => a.project - b.project),
    [address.address, sql],
  );

  const validators = useMemo(
    () =>
      sql
        .filter(
          (project: Record<string, any>) =>
            project.owner === address.address &&
            sanatise(project.validators).length > 0,
        )
        .map((project) => ({
          project: project.project,
          party: sanatise(project.validators),
          name: project.name,
          type: "Validators",
        }))
        .toSorted((a, b) => a.project - b.project),
    [address.address, sql],
  );

  const all = useMemo(
    () => [...contributors, ...validators],
    [contributors, validators],
  );

  return { contributors, validators, all };
}

function PendingContributions() {
  const { all } = useGetAll();
  // const projects = useGetProjectData() || [];
  // const projectIds = projects.map(p => p.projectId).join(',');

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (all.length < page) {
      setPage(Math.max(all.length, 1));
    }
  }, [all.length]);

  // const isCont = contributors.length < page;
  // const { project, contributors: wallets, name } = isCont ? validators[page - contributors.length - 1] : contributors[page - 1];

  return (
    <div className="flex flex-col gap-4 bg-inherit">
      {page <= all.length && (
        <>
          <ContributorsAndValidatorsManager
            projectId={all[page - 1].project}
            title={all[page - 1].name}
            type={all[page - 1].type as "Contributors" | "Validators"}
            wallets={all[page - 1].party}
          />
          <Pagination
            loop
            showControls
            className="m-auto"
            color="success"
            page={page}
            total={all.length}
            onChange={(page) => {
              setPage(page);
            }}
          />
        </>
      )}

      {/* <App wallets={[]} title="hello" /> */}
      {/* <WalletUserTable wallets={[]} title="hello" />  */}
      {/* {JSON.stringify(sql, null, 2)} */}
      {/* {contributors.map(({ project, contributors, name }) => (
        <div key={project} className="flex flex-col gap-2">
          <h2>Project contributor {project} {name}</h2>
          <App wallets={contributors} title={name} projectId={project} type="Contributors" />
        </div>
      ))}
      {validators.map(({ project, validators, name }) => (
        <div key={project} className="flex flex-col gap-2">
          <h2>Project validator {project} {name}</h2>
          <App wallets={validators} title={name} projectId={project} type="Validators" />
        </div>
      ))} */}
      {/* {JSON.stringify(contributors, null, 2)}
      {JSON.stringify(validators, null, 2)} */}
    </div>
  );
}

export default function Home() {
  const [checked, setChecked] = useState(false);
  const { all, contributors, validators } = useGetAll();

  useEffect(() => {
    if (all.length === 0) {
      setChecked(false);
    }
  }, [all.length]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {all.length > 0 && !checked && (
        <Alert
          color="warning"
          description={
            "There " +
            (contributors.length === 1 ? "is " : "are ") +
            contributors.length +
            ` contributor request${contributors.length === 1 ? "" : "s"} and ` +
            validators.length +
            " validator requests pending."
          }
          endContent={
            <Button color="danger" onPress={() => setChecked(true)}>
              Manage
            </Button>
          }
          title="Requests Pending"
        />
      )}
      {/* {all.length > 0 && !checked && <Button color="danger" onPress={() => setChecked(true)}>
        
      <Alert color="warning" title="Requests Pending" description="Click here to manage"></Alert>
        </Button>} */}
      {checked && (
        <div className="flex gap-3 align-right">
          {checked && (
            <Button color="default" onPress={() => setChecked(false)}>
              Return to manage projects
            </Button>
          )}
        </div>
      )}
      {checked && <PendingContributions />}
      {!checked && <ProjectTableWithStartModal />}
    </section>
  );
}
