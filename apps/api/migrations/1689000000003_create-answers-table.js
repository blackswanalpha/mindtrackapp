/**
 * Migration to create answers table
 */

exports.up = pgm => {
  pgm.createTable('answers', {
    id: 'id',
    response_id: {
      type: 'integer',
      notNull: true,
      references: 'responses',
      onDelete: 'CASCADE'
    },
    question_id: {
      type: 'integer',
      notNull: true,
      references: 'questions',
      onDelete: 'CASCADE'
    },
    value: { type: 'text', notNull: true },
    score: { type: 'integer' },
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
  pgm.createIndex('answers', 'response_id');
  pgm.createIndex('answers', 'question_id');
  pgm.createIndex('answers', ['response_id', 'question_id'], { unique: true });
};

exports.down = pgm => {
  pgm.dropTable('answers');
};
