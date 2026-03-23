const sql = require('mssql');

module.exports = async function (context, req) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (req.method === 'OPTIONS') {
    context.res = { status: 200, headers, body: '' };
    return;
  }

  try {
    const body = req.body;
    if (!body || !body.name || !body.municipality) {
      context.res = { status: 400, headers, body: JSON.stringify({ error: 'Name and municipality are required' }) };
      return;
    }

    const pool = await sql.connect(process.env.SQL_CONNECTION_STRING);
    const request = pool.request();

    request.input('name', sql.NVarChar, body.name);
    request.input('description', sql.NVarChar, body.description || '');
    request.input('municipality', sql.NVarChar, body.municipality);
    request.input('address', sql.NVarChar, body.address || '');
    request.input('latitude', sql.Float, body.latitude || null);
    request.input('longitude', sql.Float, body.longitude || null);
    request.input('phone', sql.NVarChar, body.phone || '');
    request.input('website', sql.NVarChar, body.website || '');

    const result = await request.query(`
      INSERT INTO Restaurants (name, description, municipality, address, latitude, longitude, phone, website)
      OUTPUT INSERTED.id
      VALUES (@name, @description, @municipality, @address, @latitude, @longitude, @phone, @website)
    `);

    context.res = {
      status: 201,
      headers,
      body: JSON.stringify({ success: true, id: result.recordset[0].id, message: `${body.name} er lagt til!` })
    };
  } catch (err) {
    context.res = {
      status: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
