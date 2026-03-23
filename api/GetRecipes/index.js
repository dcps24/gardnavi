const sql = require('mssql');

module.exports = async function (context, req) {
  try {
    const pool = await sql.connect(process.env.SQL_CONNECTION_STRING);
    const category = req.query.category;

    let query = `
      SELECT id, title, description, steps, image_url, created_at
      FROM Recipes
      WHERE 1=1
    `;

    const request = pool.request();

    if (category) {
      query += ` AND category = @category`;
      request.input('category', sql.NVarChar, category);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await request.query(query);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.recordset)
    };
  } catch (err) {
    context.res = {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
