const { getPool } = require('../db/neon');

/**
 * Base model class with common database operations
 */
class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = getPool();
  }

  /**
   * Find all records in the table
   * @param {Object} options - Query options
   * @param {Object} options.where - Where conditions
   * @param {Array} options.orderBy - Order by columns
   * @param {Number} options.limit - Limit results
   * @param {Number} options.offset - Offset results
   * @returns {Promise<Array>} - Array of records
   */
  async findAll(options = {}) {
    const { where = {}, orderBy = [], limit, offset } = options;
    
    // Build the query
    let query = `SELECT * FROM ${this.tableName}`;
    const values = [];
    
    // Add WHERE clause if conditions are provided
    if (Object.keys(where).length > 0) {
      const conditions = [];
      let paramIndex = 1;
      
      for (const [key, value] of Object.entries(where)) {
        conditions.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
      
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    // Add ORDER BY clause if specified
    if (orderBy.length > 0) {
      const orderClauses = orderBy.map(order => {
        if (typeof order === 'string') {
          return order;
        }
        return `${order.column} ${order.direction || 'ASC'}`;
      });
      
      query += ` ORDER BY ${orderClauses.join(', ')}`;
    }
    
    // Add LIMIT clause if specified
    if (limit !== undefined) {
      query += ` LIMIT ${limit}`;
    }
    
    // Add OFFSET clause if specified
    if (offset !== undefined) {
      query += ` OFFSET ${offset}`;
    }
    
    // Execute the query
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  /**
   * Find a record by ID
   * @param {Number|String} id - Record ID
   * @returns {Promise<Object|null>} - Found record or null
   */
  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find a single record by conditions
   * @param {Object} where - Where conditions
   * @returns {Promise<Object|null>} - Found record or null
   */
  async findOne(where = {}) {
    // Build the query
    let query = `SELECT * FROM ${this.tableName}`;
    const values = [];
    
    // Add WHERE clause if conditions are provided
    if (Object.keys(where).length > 0) {
      const conditions = [];
      let paramIndex = 1;
      
      for (const [key, value] of Object.entries(where)) {
        conditions.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
      
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ' LIMIT 1';
    
    // Execute the query
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} - Created record
   */
  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columns = keys.join(', ');
    
    const query = `
      INSERT INTO ${this.tableName} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update a record by ID
   * @param {Number|String} id - Record ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object|null>} - Updated record or null
   */
  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    // Generate SET clause with placeholders
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    // Add ID to values array
    values.push(id);
    
    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING *
    `;
    
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete a record by ID
   * @param {Number|String} id - Record ID
   * @returns {Promise<Boolean>} - Success status
   */
  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`;
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Count records with optional conditions
   * @param {Object} where - Where conditions
   * @returns {Promise<Number>} - Count of records
   */
  async count(where = {}) {
    // Build the query
    let query = `SELECT COUNT(*) FROM ${this.tableName}`;
    const values = [];
    
    // Add WHERE clause if conditions are provided
    if (Object.keys(where).length > 0) {
      const conditions = [];
      let paramIndex = 1;
      
      for (const [key, value] of Object.entries(where)) {
        conditions.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
      
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    // Execute the query
    const result = await this.pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Execute a raw SQL query
   * @param {String} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} - Query result
   */
  async query(sql, params = []) {
    return await this.pool.query(sql, params);
  }
}

module.exports = BaseModel;
