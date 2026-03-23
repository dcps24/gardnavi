const sql = require('mssql');

module.exports = async function (context, req) {
  try {
    const pool = await sql.connect(process.env.SQL_CONNECTION_STRING);
    const municipality = req.query.municipality;

    let query = `
      SELECT id, name, description, municipality, address,
             latitude, longitude, website, phone, image_url, created_at
      FROM Restaurants
      WHERE 1=1
    `;

    const request = pool.request();

    if (municipality) {
      query += ` AND municipality = @municipality`;
      request.input('municipality', sql.NVarChar, municipality);
    }

    query += ` ORDER BY name`;

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
