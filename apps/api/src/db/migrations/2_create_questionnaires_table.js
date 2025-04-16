/* 
 * Migration to create the questionnaires table
 */
exports.up = pgm => {
  pgm.createTable('questionnaires', {
    id: 'id',
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    type: { 
      type: 'varchar(50)', 
      notNull: true, 
      default: 'standard' 
    },
    category: { type: 'varchar(50)' },
    estimated_time: { type: 'integer' },
    is_active: { 
      type: 'boolean', 
      notNull: true, 
      default: true 
    },
    is_adaptive: { 
      type: 'boolean', 
      notNull: true, 
      default: false 
    },
    is_qr_enabled: { 
      type: 'boolean', 
      notNull: true, 
      default: true 
    },
    is_template: { 
      type: 'boolean', 
      notNull: true, 
      default: false 
    },
    is_public: { 
      type: 'boolean', 
      notNull: true, 
      default: false 
    },
    allow_anonymous: { 
      type: 'boolean', 
      notNull: true, 
      default: true 
    },
    requires_auth: { 
      type: 'boolean', 
      notNull: true, 
      default: false 
    },
    max_responses: { type: 'integer' },
    expires_at: { type: 'timestamp' },
    version: { 
      type: 'integer', 
      notNull: true, 
      default: 1 
    },
    parent_id: { 
      type: 'integer', 
      references: 'questionnaires(id)' 
    },
    tags: { type: 'jsonb' },
    organization_id: { 
      type: 'integer', 
      references: 'organizations(id)' 
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

  // Create indexes
  pgm.createIndex('questionnaires', 'created_by_id');
  pgm.createIndex('questionnaires', 'organization_id');
  pgm.createIndex('questionnaires', 'is_active');
  pgm.createIndex('questionnaires', 'is_public');
};

exports.down = pgm => {
  pgm.dropTable('questionnaires');
};
