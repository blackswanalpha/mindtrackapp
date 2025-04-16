/*
 * Migration to create the users table
 */
exports.up = pgm => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    role: {
      type: 'varchar(50)',
      notNull: true,
      default: 'user',
      check: "role IN ('admin', 'healthcare_provider', 'user')"
    },
    profile_image: { type: 'varchar(255)' },
    last_login: { type: 'timestamp' },
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

  // Create index on email for faster lookups
  pgm.createIndex('users', 'email');
};

exports.down = pgm => {
  pgm.dropTable('users');
};