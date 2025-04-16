/**
 * Migration to create organizations table
 */

exports.up = pgm => {
  pgm.createTable('organizations', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    type: { type: 'varchar(100)' },
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
  
  // Add indexes
  pgm.createIndex('organizations', 'name');
  pgm.createIndex('organizations', 'type');
  
  // Create organization_members table for many-to-many relationship
  pgm.createTable('organization_members', {
    id: 'id',
    organization_id: {
      type: 'integer',
      notNull: true,
      references: 'organizations',
      onDelete: 'CASCADE'
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE'
    },
    role: {
      type: 'varchar(50)',
      notNull: true,
      default: 'member',
      check: "role IN ('admin', 'member', 'viewer')"
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
  
  // Add indexes and constraints
  pgm.createIndex('organization_members', 'organization_id');
  pgm.createIndex('organization_members', 'user_id');
  pgm.createIndex('organization_members', ['organization_id', 'user_id'], { unique: true });
};

exports.down = pgm => {
  pgm.dropTable('organization_members');
  pgm.dropTable('organizations');
};
