/* 
 * Migration to create the scoring_configs table
 */
exports.up = pgm => {
  pgm.createTable('scoring_configs', {
    id: 'id',
    questionnaire_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'questionnaires(id)',
      onDelete: 'CASCADE'
    },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    scoring_method: { 
      type: 'varchar(50)', 
      notNull: true,
      default: 'sum',
      check: "scoring_method IN ('sum', 'average', 'weighted_average', 'custom')"
    },
    max_score: { type: 'integer' },
    passing_score: { type: 'integer' },
    is_active: { 
      type: 'boolean', 
      notNull: true, 
      default: true 
    },
    rules: { type: 'jsonb', notNull: true },
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
  pgm.createIndex('scoring_configs', 'questionnaire_id');
  pgm.createIndex('scoring_configs', 'created_by_id');
};

exports.down = pgm => {
  pgm.dropTable('scoring_configs');
};
