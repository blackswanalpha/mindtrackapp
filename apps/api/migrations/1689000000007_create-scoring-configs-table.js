/**
 * Migration to create scoring_configs table
 */

exports.up = pgm => {
  pgm.createTable('scoring_configs', {
    id: 'id',
    questionnaire_id: {
      type: 'integer',
      notNull: true,
      references: 'questionnaires',
      onDelete: 'CASCADE'
    },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    scoring_method: {
      type: 'varchar(50)',
      notNull: true,
      default: 'sum',
      check: "scoring_method IN ('sum', 'average', 'custom')"
    },
    scoring_rules: { type: 'jsonb', notNull: true },
    risk_levels: { type: 'jsonb', notNull: true },
    created_by_id: {
      type: 'integer',
      references: 'users',
      onDelete: 'SET NULL'
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
  pgm.createIndex('scoring_configs', 'questionnaire_id');
  pgm.createIndex('scoring_configs', 'created_by_id');
};

exports.down = pgm => {
  pgm.dropTable('scoring_configs');
};
