import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
 
dotenv.config({ path: ".env.local" });
 
const sql = neon(process.env.DATABASE_URL);
 
async function seed() {
  console.log("Seeding database...\n");

// scripts/seed-db.js
// Populates the database with sample Indonesian library data.
// Usage: node scripts/seed-db.js

import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱  Seeding database...\n");

  // ── Members ───────────────────────────────────────────────────────────────
  await sql`
    INSERT INTO members (name, email, phone, address, membership_date) VALUES
      ('Denok Intan',   'denokintq@gmail.com',   '081234567890', 'Jl. Merdeka No. 10, Jakarta',      '2022-01-15'),
      ('Muhammad Ilham',    'muhilham5498@gmail.com',   '082345678901', 'Jl. Sudirman No. 25, Bandung',     '2022-03-20'),
      ('Revo Risky',    'revorisky48@gmail.com',  '083456789012', 'Jl. Diponegoro No. 5, Surabaya',   '2022-06-10'),
      ('Fadhlan Yuqa', 'fadhlanyuqa21@gmail.com',   '084567890123', 'Jl. Gatot Subroto No. 8, Medan',   '2023-01-05'),
    ON CONFLICT (email) DO NOTHING
  `;
  console.log("✅  Members seeded");

  // ── Books ─────────────────────────────────────────────────────────────────
  await sql`
    INSERT INTO books (title, author, isbn, category, stock) VALUES
      ('Laskar Pelangi',              'Andrea Hirata',      '978-979-3062-79-9', 'Novel',     5),
      ('Bumi Manusia',                'Pramoedya A. Toer',  '978-979-407-886-0', 'Sastra',    4),
      ('Atomic Habits',               'James Clear',        '978-0-7352-1129-2', 'Self-Help', 6),
      ('Clean Code',                  'Robert C. Martin',   '978-0-13-235088-4', 'Teknologi', 3),
      ('Sapiens',                     'Yuval Noah Harari',  '978-0-06-231609-7', 'Sejarah',   4),
      ('Negeri 5 Menara',             'Ahmad Fuadi',        '978-979-22-5309-8', 'Novel',     5),
      ('The Pragmatic Programmer',    'Andy Hunt',          '978-0-13-595705-9', 'Teknologi', 3),
      ('Rich Dad Poor Dad',           'Robert T. Kiyosaki', '978-1-61268-116-4', 'Keuangan',  6),
      ('Filosofi Teras',              'Henry Manampiring',  '978-602-03-9510-9', 'Self-Help', 4),
      ('Dilan 1990',                  'Pidi Baiq',          '978-602-7888-45-8', 'Novel',     5)
    ON CONFLICT (isbn) DO NOTHING
  `;
  console.log("✅  Books seeded");

  // ── Loans ─────────────────────────────────────────────────────────────────
  // Budi (member 1) – 10 loans, heavy reader
  // Siti (member 2) –  7 loans
  // Ahmad (member 3) – 6 loans
  // Others           – fewer loans
  await sql`
    INSERT INTO loans (member_id, book_id, loan_date, due_date, return_date, status) VALUES
await sql`

  -- Denok (id=1)
  (1, 1, '2024-01-01', '2024-01-10', '2024-01-09', 'returned'),
  (1, 1, '2024-02-01', '2024-02-10', '2024-02-09', 'returned'),
  (1, 2, '2024-03-01', '2024-03-10', '2024-03-09', 'returned'),
  (1, 3, '2024-04-01', '2024-04-10', '2024-04-09', 'returned'),
  (1, 1, '2024-05-01', '2024-05-10', '2024-05-09', 'returned'),
  (1, 2, '2025-01-01', '2025-01-10', NULL, 'active'),

  -- Ilham (id=2)
  (2, 2, '2024-01-05', '2024-01-15', '2024-01-14', 'returned'),
  (2, 2, '2024-02-05', '2024-02-15', '2024-02-14', 'returned'),
  (2, 4, '2024-03-05', '2024-03-15', '2024-03-14', 'returned'),
  (2, 2, '2025-01-05', '2025-01-15', NULL, 'active'),

  -- Revo (id=3)
  (3, 3, '2024-01-10', '2024-01-20', '2024-01-19', 'returned'),
  (3, 3, '2024-02-10', '2024-02-20', '2024-02-19', 'returned'),
  (3, 5, '2025-01-10', '2025-01-20', NULL, 'active'),

  -- Yuqa (id=4)
  (4, 1, '2024-01-15', '2024-01-25', '2024-01-24', 'returned'),
  (4, 1, '2024-02-15', '2024-02-25', '2024-02-24', 'returned'),
  (4, 4, '2024-03-15', '2024-03-25', '2024-03-24', 'returned'),
  (4, 1, '2024-04-15', '2024-04-25', '2024-04-24', 'returned'),
  (4, 2, '2024-05-15', '2024-05-25', '2024-05-24', 'returned'),
  (4, 1, '2024-06-15', '2024-06-25', '2024-06-24', 'returned'),
  (4, 3, '2025-01-15', '2025-01-25', NULL, 'active')
  `;
  console.log("  Loans seeded");

  console.log("\n  Seed complete! Database is ready.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("  Seed failed:", err.message);
  process.exit(1);
});
