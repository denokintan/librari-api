

import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  console.log("🔧  Setting up database schema...\n");

  await sql`
    CREATE TABLE IF NOT EXISTS members (
      id              SERIAL        PRIMARY KEY,
      name            VARCHAR(150)  NOT NULL,
      email           VARCHAR(150)  NOT NULL UNIQUE,
      phone           VARCHAR(20),
      address         TEXT,
      membership_date DATE          NOT NULL DEFAULT CURRENT_DATE,
      created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    )
  `;
  console.log("✅  Table 'members' ready");

  await sql`
    CREATE TABLE IF NOT EXISTS books (
      id           SERIAL        PRIMARY KEY,
      title        VARCHAR(255)  NOT NULL,
      author       VARCHAR(150)  NOT NULL,
      isbn         VARCHAR(20)   UNIQUE,
      category     VARCHAR(100),
      stock        INTEGER       NOT NULL DEFAULT 1,
      created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    )
  `;
  console.log("✅  Table 'books' ready");

  await sql`
    CREATE TABLE IF NOT EXISTS loans (
      id           SERIAL       PRIMARY KEY,
      member_id    INTEGER      NOT NULL REFERENCES members(id) ON DELETE CASCADE,
      book_id      INTEGER      NOT NULL REFERENCES books(id)   ON DELETE CASCADE,
      loan_date    DATE         NOT NULL DEFAULT CURRENT_DATE,
      due_date     DATE         NOT NULL,
      return_date  DATE,
      status       VARCHAR(20)  NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active', 'returned', 'overdue')),
      created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
  console.log("✅  Table 'loans' ready");

  await sql`CREATE INDEX IF NOT EXISTS idx_loans_member_id ON loans(member_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_loans_book_id   ON loans(book_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_loans_loan_date ON loans(loan_date DESC)`;
  console.log("✅  Indexes created");

  console.log("\n🎉  Database setup complete!");
  process.exit(0);
}

setupDatabase().catch((err) => {
  console.error("❌  Setup failed:", err.message);
  process.exit(1);
});
