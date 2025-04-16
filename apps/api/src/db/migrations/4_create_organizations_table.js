/* 
 * Migration to create the organizations table
 */
exports.up = pgm => {
  pgm.createTable('organizations', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    type: { type: 'varchar(50)' },
    contact_email: { type: 'varchar(255)' },
    contact_phone: { type: 'varchar(50)' },
    address: { type: 'text' },
    logo_url: { type: 'varchar(255)' },
    settings: { type: 'jsonb' },
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
};

exports.down = pgm => {
  pgm.dropTable('organizations');
};
