/**
 * Migration to create questions table
 */

exports.up = pgm => {
  pgm.createTable('questions', {
    id: 'id',
    questionnaire_id: {
      type: 'integer',
      notNull: true,
      references: 'questionnaires',
      onDelete: 'CASCADE'
    },
    text: { type: 'text', notNull: true },
    description: { type: 'text' },
    type: {
      type: 'varchar(50)',
      notNull: true,
      default: 'text',
      check: "type IN ('text', 'single_choice', 'multiple_choice', 'rating', 'yes_no', 'scale', 'date')"
    },
    required: { type: 'boolean', default: true },
    order_num: { type: 'integer', notNull: true },
    options: { type: 'jsonb' },
    conditional_logic: { type: 'jsonb' },
    validation_rules: { type: 'jsonb' },
    scoring_weight: { type: 'integer', default: 1 },
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
  pgm.createIndex('questions', 'questionnaire_id');
  pgm.createIndex('questions', ['questionnaire_id', 'order_num']);
  pgm.createIndex('questions', 'type');
};

exports.down = pgm => {
  pgm.dropTable('questions');
};
