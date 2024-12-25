"use client";

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { Checkbox } from "@nextui-org/checkbox";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { WagmiCompoment } from "@/components/wallet";
import { CreateContractButton } from "@/components/create-project";
import { ProjectTable } from "@/components/project-list";
import BaseTable, { ProjectTableWithStartModal } from "@/components/table/table";
import { WalletUser, WalletUsersScrollable } from "@/components/user";
import { StartProjectForm, StartProjectPage } from "@/components/start-project";
import { CreateTokenModal } from "@/components/create-token";
import { Modal, useDisclosure } from "@nextui-org/modal";
import { OwnerButton } from "@/components/table/ownerButton";
import { useContext, useEffect, useMemo, useState } from "react";
import { clearContributors, clearValidators, Page, sanatise } from "./postgres";
import { SQLContext } from "./providers";
import { useAccount } from "wagmi";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import {Pagination} from "@nextui-org/pagination";

import React from "react";
import {
  RadioGroup,
  Radio,
} from "@nextui-org/radio";
import { Button } from "@nextui-org/button";
import { useAddValidatorsOrContributors } from "@/hooks/addContributor";
import { check } from "prettier";

 
function ContributorsAndValidatorsManager({ wallets, title, projectId, type }: { wallets: `0x${string}`[]; title: string; projectId: number, type: "Contributors" | "Validators" }) {
  const { add, isPending, isSuccess, ...args } = useAddValidatorsOrContributors();
  const [keys, setKeys] = useState<Set<number | string> | "all">(new Set<number | string>());
  const reset = useContext(SQLContext)[1];
  // console.log("agr", args)

  useEffect(() => {
    if (isSuccess) {
      clearContributors(projectId);
      reset();
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col gap-3">
      <Button
        isDisabled
        children={<>{type.slice(0, -1) + ' requests for'}<b>{title}</b></>}
        color="secondary"
      />
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
      <span
      className="flex"
      >
      <Button
      className="w-5/12"
      color="warning"
      onPress={
        () => {
          if (type === "Contributors")
            clearContributors(projectId);
          else
            clearValidators(projectId);

          reset();
        }
      }
      isDisabled={isPending || wallets.length === 0}
      >Add None</Button>
      <Button
      className="w-5/12 ml-auto"
      color="success"
      onPress={
        () => {
          console.log("ADDING CONTRIBUTORS", projectId, keys);
          add(type, [
            BigInt(projectId),
            keys === "all" ? wallets : wallets.filter((_, i) => keys.has(i) || keys.has(`${i}`))
          ]);
          setKeys(new Set());
        }
      }
      isDisabled={isPending || wallets.length === 0 || (typeof keys === 'object' && keys.size === 0)}
      >Add {type}</Button>
      
      </span>
    </div>
  );
}

function DisplayColumn(props: { columnKey: "name", value: string } | { columnKey: "wallet", value: `0x${string}` } | { columnKey: "enabled", value: boolean, onChange: () => void }) {
  switch (props.columnKey) {
    case "wallet":
      return <WalletUser address={props.value} />;
    case "name":
      return props.value;
    case "enabled":
      return <Checkbox isSelected={props.value} className="p-5" onChange={props.onChange} />;
  }
}

function WalletUserTable({ wallets, title }: { wallets: string[]; title: string }) {
  // const [checked, setChecked] = useState(false);
  const [items, setItems] = useState(() => wallets.map(wallet => ({ wallet, enabled: true })));

  useEffect(() => {
    setItems(wallets.map(wallet => ({ wallet, enabled: true })));
  }, [wallets]);

  console.log("WALLET USER TABLE", items);

  return (
  <Table title="Wallets">
  <TableHeader columns={[
  {name: "Account", uid: "wallet", sortable: true},
  // {name: "Project Name", uid: "name", sortable: true},
  {name: "Enabled", uid: "enabled", sortable: true},
  ]}>
    {(elem) => <TableColumn key={elem.uid}>
        {elem.name}
    </TableColumn>}
  </TableHeader>
  <TableBody emptyContent={"No projects found"} items={
      // [{ projectId: 1, owner: "hello", wallet: "0xb17431E497dd0289e076dAF827C036ea90e17cDb", name: "hello", enabled: true }]
      items
    }>
    {(item) => (
      <TableRow key={item.wallet}>
        {/* {
          //@ts-ignore
        (columnKey) => <DisplayColumn columnKey={co\
        lumnKey} value={item[columnKey]} />
        } */}
        {/* @ts-ignore */}
        {(columnKey) => <TableCell>{DisplayColumn({ columnKey, value: item[columnKey], onChange: () =>  {
          setItems(items.map(i => i.wallet === item.wallet ? { ...i, enabled: !i.enabled } : i));
        } })}</TableCell>}
      </TableRow>
    )}
  </TableBody>
</Table>);
}

function getAll() {
  const address = useAccount();
  const sql = useContext(SQLContext)[0] || [];
  const contributors = useMemo(
    () => sql.filter((
      (project: Record<string, any>) => 
        project.owner === address.address
        && sanatise(project.contributors).length > 0
      )
    ).map(project => ({ project: project.project, party: sanatise(project.contributors), name: project.name, type: "Contributors" }))
    .toSorted((a, b) => a.project - b.project),
    [address.address, sql]
  );

  const validators = useMemo(
    () => sql.filter((
      (project: Record<string, any>) => 
        project.owner === address.address
        && sanatise(project.validators).length > 0
      )
    ).map(project => ({ project: project.project, party: sanatise(project.validators), name: project.name, type: "Validators" }))
    .toSorted((a, b) => a.project - b.project),
    [address.address, sql]
  );

  const all = useMemo(() => [...contributors, ...validators], [contributors, validators]);
  return all;
}

function PendingContributions() {
  const all = getAll();
  // const projects = useGetProjectData() || [];
  // const projectIds = projects.map(p => p.projectId).join(',');
  

  // console.log("PROJECYS", contributors);

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (all.length < page) {
      setPage(Math.max(all.length, 1));
    }
  }, [all.length]);

  // const isCont = contributors.length < page;
  // const { project, contributors: wallets, name } = isCont ? validators[page - contributors.length - 1] : contributors[page - 1];

  return (
    <div className="flex flex-col gap-4">
      {page <= all.length && <>
      <ContributorsAndValidatorsManager wallets={all[page - 1].party} title={all[page - 1].name} projectId={all[page - 1].project} type={all[page - 1].type as "Contributors" | "Validators"} />
      <Pagination onChange={page => {setPage(page)}} className="m-auto" loop showControls color="success" page={page} total={all.length} />
      </>}
      

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
  const all = getAll();

  useEffect(() => {
    if (all.length === 0) {
      setChecked(false);
    }
  }, [all.length]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {all.length > 0 && !checked && <Button color="danger" onPress={() => setChecked(true)}>(?) Manage pending requests</Button>}
      {checked && <PendingContributions />}
      {checked && <Button color="danger" onPress={() => setChecked(false)}>Return to manage projects</Button>}
      {/* <Page /> */}
      {/* <h1 className={title}>Wagmi</h1>
      {/* <StartProjectPage /> */}
      {/* <CreateTokenModal />
      <StartProjectPage />
      <WalletUsersScrollable addresses={[
        "0xb17431E497dd0289e076dAF827C036ea90e17cDb",
        "0xC771cb2F591001eee1690CC8A82f0045A774A4BC",
        "0xbEE7f7795d90DCf976cD2990cb5F79FAE9207419",
        "0x00d936ef12a4Fde33Ab0FcF08F18d6A9BAbB6b97",
        "0xb17431E497dd0289e076dAF827C036ea90e17cDb",
        "0x773cd1Eed5E018d1E4903dda602A28203a97CC57",
        "0xb17431E497dd0289e076dAF827C036ea90e17cDb",
        "0xb17431E497dd0289e076dAF827C036ea90e17cDb",
        "0xb17431E497dd0289e076dAF827C036ea90e17cDb",
        "0xb17431E497dd0289e076dAF827C036ea90e17cDb",

        
      ]} />

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="flex gap-3">
        <CreateContractButton />
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            <WagmiCompoment />
          </span>
        </Snippet>
      </div> */}

      {/* <ProjectTable /> */}
      {!checked && <ProjectTableWithStartModal />}
    </section>
  );
}
