import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { WagmiCompoment } from "@/components/wallet";
import { CreateContractButton } from "@/components/create-project";
import { ProjectTable } from "@/components/project-list";
import BaseTable from "@/components/table";
import { WalletUsersScrollable } from "@/components/user";
import { StartProjectForm, StartProjectPage } from "@/components/start-project";
import { CreateTokenModal } from "@/components/create-token";
import { Modal } from "@nextui-org/modal";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <CreateTokenModal />
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
      </div>

      {/* <ProjectTable /> */}
      <BaseTable />
    </section>
  );
}
