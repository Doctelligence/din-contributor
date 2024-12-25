// File: setup.js

// Load all the environment variables
require('dotenv').config();

const { Client } = require('pg');

const connectionString = process.env.POSTGRES_URL;

async function setupTrigger() {
  const client = new Client({ connectionString });

  try {
    // Connect to Postgres
    await client.connect();
    // Create a my_table if it does not already exist
    await client.query(`CREATE TABLE IF NOT EXISTS
    my_table (id SERIAL PRIMARY KEY, message TEXT)`);
    // Define the my_trigger_2_function_3 function to send notifications
    await client.query(`
    CREATE OR REPLACE FUNCTION my_trigger_2_function_3() RETURNS trigger AS $$
    BEGIN
      PERFORM pg_notify('channel_name', '-');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`);
    // Create the my_trigger_2 to call the my_trigger_2_function_3 after each insert, update, or delete
    await client.query(`
    CREATE TRIGGER my_trigger_2
    AFTER INSERT OR UPDATE OR DELETE ON my_table
    FOR EACH ROW
    EXECUTE FUNCTION my_trigger_2_function_3();`);
    console.log('Event triggers setup complete.');

    // A trigger function for when any update is made to the table
    await client.end();
  } catch (e) {
    console.log(e);
  }
}

async function listenToNotifications() {
  const client = new Client({ connectionString });

  try {
    // Connect to Postgres
    await client.connect();
    // Listen to specific channel in Postgres
    // Attach a listener to notifications received
    client.on('notification', (msg) => {
      console.log('Notification received', msg.payload);
    });
    await client.query('LISTEN channel_name');
    console.log('Listening for notifications on my_channel');

    // Insert new row
    const full_res = await client.query(`INSERT INTO my_table (message) VALUES ('Hello, world!')`);
    
    // Select and log the entire table

    const res = await client.query('SELECT * FROM my_table');
    // console.log(res.rows);
    const maxId = Math.max(...res.rows.map(row => row.id));

    // Modify existing row
    await client.query(`UPDATE my_table SET message = 'Hello, Postgres!' WHERE id = ${maxId}`);

    const res2 = await client.query('SELECT * FROM my_table');
    // console.log(res2);

    // Delete existing row
    await client.query(`DELETE FROM my_table WHERE id = ${maxId}`);

  } catch (e) {
    console.log(e);
  }
}

setupTrigger()
  .then(() => listenToNotifications())
  .catch(console.log);
