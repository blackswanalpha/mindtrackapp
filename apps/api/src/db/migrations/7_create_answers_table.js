/* 
 * Migration to create the answers table
 */
exports.up = pgm => {
  pgm.createTable('answers', {
    id: 'id',
    response_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'responses(id)',
      onDelete: 'CASCADE'
    },
    question_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'questions(id)',
      onDelete: 'CASCADE'
    },
    value: { type: 'text', notNull: true },
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
  pgm.createIndex('answers', 'response_id');
  pgm.createIndex('answers', 'question_id');
  
  // Create unique constraint to prevent duplicate answers
  pgm.createConstraint('answers', 'unique_response_question', {
    unique: ['response_id', 'question_id']
  });
};

exports.down = pgm => {
  pgm.dropTable('answers');
};
