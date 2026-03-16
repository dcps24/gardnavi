const sql = require('mssql');

module.exports = async function (context, req) {
  try {
    const pool = await sql.connect(process.env.SQL_CONNECTION_STRING);
    
    const result = await pool.request().query(`
      SELECT id, name, description, municipality, 
             address, latitude, longitude, 
             website, phone, email, image_url
      FROM Farms
    `);

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
      body: 'Database error: ' + err.message
    };
  }
};
