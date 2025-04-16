/**
 * Migration to create questionnaires table
 */

exports.up = pgm => {
  pgm.createTable('questionnaires', {
    id: 'id',
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    type: { type: 'varchar(50)', default: 'standard' },
    category: { type: 'varchar(100)' },
    estimated_time: { type: 'integer' },
    is_active: { type: 'boolean', default: true },
    is_adaptive: { type: 'boolean', default: false },
    is_qr_enabled: { type: 'boolean', default: true },
    is_template: { type: 'boolean', default: false },
    is_public: { type: 'boolean', default: false },
    allow_anonymous: { type: 'boolean', default: true },
    requires_auth: { type: 'boolean', default: false },
    max_responses: { type: 'integer' },
    expires_at: { type: 'timestamp' },
    tags: { type: 'jsonb' },
    organization_id: { type: 'integer', references: 'organizations' },
    created_by_id: { type: 'integer', notNull: true, references: 'users' },
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
  pgm.createIndex('questionnaires', 'created_by_id');
  pgm.createIndex('questionnaires', 'organization_id');
  pgm.createIndex('questionnaires', 'is_active');
  pgm.createIndex('questionnaires', 'is_public');
  pgm.createIndex('questionnaires', 'is_template');
  pgm.createIndex('questionnaires', 'type');
  pgm.createIndex('questionnaires', 'category');
  
  // Add full-text search index
  pgm.createIndex('questionnaires', ['title', 'description'], {
    method: 'GIN',
    name: 'questionnaires_search_idx',
    expression: 'to_tsvector(\'english\', title || \' \' || COALESCE(description, \'\'))'
  });
};

exports.down = pgm => {
  pgm.dropTable('questionnaires');
};
