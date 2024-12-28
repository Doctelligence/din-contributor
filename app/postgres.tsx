"server side";

import { neon } from "@neondatabase/serverless";

import { CONTRACT_ADDRESS } from "@/contract/config";
import { TABLE_VERSIONS } from "@/config/site";

export const TABLE_NAME =
  "T" + CONTRACT_ADDRESS.slice(2) + "_" + TABLE_VERSIONS;

export const POSTGRES_URL =
  "postgres://neondb_owner:0zmWUvu6Txpa@ep-summer-surf-a53fy2kl-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require";
const POSTGRES_URL_NON_POOLING =
  "postgres://neondb_owner:0zmWUvu6Txpa@ep-summer-surf-a53fy2kl.us-east-2.aws.neon.tech/neondb?sslmode=require";
const POSTGRES_USER = "neondb_owner";
const POSTGRES_HOST = "ep-summer-surf-a53fy2kl-pooler.us-east-2.aws.neon.tech";
const POSTGRES_PASSWORD = "0zmWUvu6Txpa";
const POSTGRES_DATABASE = "neondb";
const POSTGRES_URL_NO_SSL =
  "postgres://neondb_owner:0zmWUvu6Txpa@ep-summer-surf-a53fy2kl-pooler.us-east-2.aws.neon.tech/neondb";
const POSTGRES_PRISMA_URL =
  "postgres://neondb_owner:0zmWUvu6Txpa@ep-summer-surf-a53fy2kl-pooler.us-east-2.aws.neon.tech/neondb?pgbouncer=true&connect_timeout=15&sslmode=require";

async function getData() {
  const sql = neon(POSTGRES_URL as string);
  const response = await sql`SELECT * FROM ${TABLE_NAME};  
`;

  // const response = {};
  return JSON.stringify(response, null, 2);
}

export async function create() {
  const sql = neon(POSTGRES_URL as string);

  await sql`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (project INT, name TEXT, owner TEXT, contributors TEXT, validators TEXT)`;
  // await sql(`INSERT INTO ${TABLE_NAME} (project, owner, contributors, validators) VALUES ($1, $2, $3, $4)`, [1, "0x1", "0x2,0x3", "0x4"]);
}

// Set the contributors column ton "hello world" in the row with the project id of 1
export async function update() {
  const sql = neon(POSTGRES_URL as string);

  await sql(`UPDATE ${TABLE_NAME} SET contributors = $1 WHERE project = $2`, [
    "hello world",
    1,
  ]);
}

// Append  "hello world" to the current value of the contributors column in the row with the project id of 1
export async function appendValidators(project: number, validator: string) {
  const sql = neon(POSTGRES_URL as string);

  await sql(
    `UPDATE ${TABLE_NAME} SET validators = validators || $1 WHERE project = $2`,
    [";" + validator, project],
  );
}

export async function appendContributors(project: number, contributor: string) {
  const sql = neon(POSTGRES_URL as string);

  await sql(
    `UPDATE ${TABLE_NAME} SET contributors = contributors || $1 WHERE project = $2`,
    [";" + contributor, project],
  );
}

export async function clearContributors(project: number) {
  const sql = neon(POSTGRES_URL as string);

  await sql(`UPDATE ${TABLE_NAME} SET contributors = '' WHERE project = $1`, [
    project,
  ]);
}

export async function clearValidators(project: number) {
  const sql = neon(POSTGRES_URL as string);

  await sql(`UPDATE ${TABLE_NAME} SET validators = '' WHERE project = $1`, [
    project,
  ]);
}

// Get all ${TABLE_NAME} associated with the owner "0x1"
export async function getProjects(owner: string) {
  const sql = neon(POSTGRES_URL as string);
  const response =
    await sql`SELECT * FROM ${TABLE_NAME} WHERE owner = ${owner}`;

  return response;
}

export async function getAllProjects() {
  const sql = neon(POSTGRES_URL as string);
  const posts = await sql.transaction([
    sql(
      `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (project INT, name TEXT, owner TEXT, contributors TEXT, validators TEXT)`,
    ),
    sql(`
    CREATE OR REPLACE FUNCTION my_trigger_2_function_3() RETURNS trigger AS $$
    BEGIN
      PERFORM pg_notify('channel_name', 'true');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`),
    sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'my_trigger_2') THEN
        CREATE TRIGGER my_trigger_2
        AFTER INSERT OR UPDATE OR DELETE ON ${TABLE_NAME}
        FOR EACH ROW
        EXECUTE FUNCTION my_trigger_2_function_3();
      END IF;
    END;
    $$;`),
    // sql(`INSERT INTO ${TABLE_NAME} (project, owner, contributors÷, validators) VALUES ($1, $2, $3, $4)`, [1, "0x1", "0x2,0x3", "0x4"]),
    sql(`SELECT * FROM ${TABLE_NAME}`),
  ]);

  // await client.query(`CREATE TABLE IF NOT EXISTS
  //   my_table (id SERIAL PRIMARY KEY, message TEXT)`);
  //   // Define the my_trigger_2_function_3 function to send notifications
  //   await client.query(`
  //   CREATE OR REPLACE FUNCTION my_trigger_2_function_3() RETURNS trigger AS $$
  //   BEGIN
  //     PERFORM pg_notify('channel_name', 'true');
  //     RETURN NEW;
  //   END;
  //   $$ LANGUAGE plpgsql;`);
  //   // Create the my_trigger_2 to call the my_trigger_2_function_3 after each insert, update, or delete
  //   await client.query(`
  //   CREATE TRIGGER my_trigger_2
  //   AFTER INSERT OR UPDATE OR DELETE ON my_table
  //   FOR EACH ROW
  //   EXECUTE FUNCTION my_trigger_2_function_3();`);
  //   console.log('Event triggers setup complete.');

  // await sql`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (project INT, owner TEXT, contributors TEXT, validators TEXT)`
  // const response = await sql`SELECT * FROM ${TABLE_NAME}`;
  return posts[3];
}

// Delete the row with the given id
async function deleteProject(project: number) {
  const sql = neon(POSTGRES_URL as string);

  await sql(`DELETE FROM ${TABLE_NAME} WHERE project = $1`, [project]);
}

// Remove the regex pattern "hello;?" from the contributors column in the row with the project id of 1
async function removeContributors(project: number, address: string) {
  const sql = neon(POSTGRES_URL as string);

  await sql(
    `UPDATE ${TABLE_NAME} SET validators = REPLACE(REPLACE(REPLACE(validators, $1, ''), ';;', ';'), ';;', ';') WHERE project = $2`,
    [address, project],
  );
}

export function sanatise(input: string): `0x${string}`[] {
  const res = input.split(";").filter((x) => x.length > 0);

  return res.filter((x, i) => !res.slice(0, i).includes(x)) as `0x${string}`[];

  // console.log("SANATISE", res);

  // const elems: string[] = [];
  // for (const elem in new Set(res)) {
  //   elems.push(elem);
  // }

  // console.log("SANATISED", elems);

  // return elems;
}

export async function Page() {
  const data = await getData();

  return (
    <>
      <form action={() => removeContributors(1, "0x5")}>
        <input name="comment" placeholder="write a comment" type="text" />
        <button type="submit">Submit</button>
      </form>
      {data}
    </>
  );
}
