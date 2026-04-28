
import { getDb } from "../../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed. Use GET.`,
    });
  }

  try {
    const sql = getDb();

    const rows = await sql`
      WITH loan_counts AS (
        SELECT
          l.member_id,
          COUNT(*)                          AS total_loans,
          MAX(l.loan_date)                  AS last_loan_date
        FROM loans l
        GROUP BY l.member_id
      ),

      book_borrow_freq AS (
        SELECT
          l.member_id,
          l.book_id,
          COUNT(*) AS borrow_count,
          RANK() OVER (
            PARTITION BY l.member_id
            ORDER BY COUNT(*) DESC
          ) AS rnk
        FROM loans l
        GROUP BY l.member_id, l.book_id
      ),

      favorite_books AS (
        SELECT
          bbf.member_id,
          b.title AS favorite_book
        FROM book_borrow_freq bbf
        JOIN books b ON b.id = bbf.book_id
        WHERE bbf.rnk = 1
      )

      SELECT
        m.id              AS member_id,
        m.name,
        m.email,
        m.phone,
        m.address,
        m.membership_date,
        lc.total_loans,
        fb.favorite_book,
        lc.last_loan_date
      FROM loan_counts    lc
      JOIN members        m  ON m.id = lc.member_id
      LEFT JOIN favorite_books fb ON fb.member_id = lc.member_id
      ORDER BY lc.total_loans DESC
      LIMIT 3
    `;

    const topBorrowers = rows.map((row) => ({
      member: {
        id: row.member_id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        membership_date: row.membership_date,
      },
      stats: {
        total_loans: Number(row.total_loans),
        favorite_book: row.favorite_book ?? null,
        last_loan_date: row.last_loan_date,
      },
    }));

    return res.status(200).json({
      success: true,
      message: "Top 3 borrowers retrieved successfully",
      data: topBorrowers,
    });
  } catch (error) {
    console.error("[top-borrowers] Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
