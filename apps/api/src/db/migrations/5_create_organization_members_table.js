/* 
 * Migration to create the organization_members table
 */
exports.up = pgm => {
  pgm.createTable('organization_members', {
    id: 'id',
    organization_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'organizations(id)',
      onDelete: 'CASCADE'
    },
    user_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'users(id)',
      onDelete: 'CASCADE'
    },
    role: { 
      type: 'varchar(50)', 
      notNull: true,
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

  // Create indexes
  pgm.createIndex('organization_members', 'organization_id');
  pgm.createIndex('organization_members', 'user_id');
  
  // Create unique constraint to prevent duplicate memberships
  pgm.createConstraint('organization_members', 'unique_organization_user', {
    unique: ['organization_id', 'user_id']
  });
};

exports.down = pgm => {
  pgm.dropTable('organization_members');
};
