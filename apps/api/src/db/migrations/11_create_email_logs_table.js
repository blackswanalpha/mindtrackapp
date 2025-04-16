/* 
 * Migration to create the email_logs table
 */
exports.up = pgm => {
  pgm.createTable('email_logs', {
    id: 'id',
    recipient: { 
      type: 'varchar(255)', 
      notNull: true 
    },
    subject: { 
      type: 'varchar(255)', 
      notNull: true 
    },
    template_id: { 
      type: 'integer', 
      references: 'email_templates(id)' 
    },
    response_id: { 
      type: 'integer', 
      references: 'responses(id)' 
    },
    sent_by_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'users(id)' 
    },
    sent_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'sent'
    },
    error_message: { 
      type: 'text' 
    }
  });
  
  // Add indexes
  pgm.createIndex('email_logs', 'recipient');
  pgm.createIndex('email_logs', 'template_id');
  pgm.createIndex('email_logs', 'response_id');
  pgm.createIndex('email_logs', 'sent_by_id');
  pgm.createIndex('email_logs', 'sent_at');
  pgm.createIndex('email_logs', 'status');
};

exports.down = pgm => {
  pgm.dropTable('email_logs');
};
