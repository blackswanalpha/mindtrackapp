/* 
 * Migration to create the ai_analyses table
 */
exports.up = pgm => {
  pgm.createTable('ai_analyses', {
    id: 'id',
    response_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'responses(id)',
      onDelete: 'CASCADE'
    },
    prompt: { type: 'text', notNull: true },
    analysis: { type: 'text', notNull: true },
    recommendations: { type: 'text' },
    risk_assessment: { type: 'text' },
    model_used: { type: 'varchar(255)', notNull: true },
    created_by_id: { 
      type: 'integer', 
      references: 'users(id)'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  // Create indexes
  pgm.createIndex('ai_analyses', 'response_id');
  pgm.createIndex('ai_analyses', 'created_by_id');
};

exports.down = pgm => {
  pgm.dropTable('ai_analyses');
};
