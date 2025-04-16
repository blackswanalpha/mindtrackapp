/* 
 * Migration to create the email_templates table
 */
exports.up = pgm => {
  pgm.createTable('email_templates', {
    id: 'id',
    name: { 
      type: 'varchar(100)', 
      notNull: true,
      unique: true
    },
    subject: { 
      type: 'varchar(255)', 
      notNull: true 
    },
    body: { 
      type: 'text', 
      notNull: true 
    },
    variables: { 
      type: 'jsonb',
      default: '[]'
    },
    created_by_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'users(id)' 
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
  
  // Add indexes
  pgm.createIndex('email_templates', 'name');
  pgm.createIndex('email_templates', 'created_by_id');
};

exports.down = pgm => {
  pgm.dropTable('email_templates');
};
