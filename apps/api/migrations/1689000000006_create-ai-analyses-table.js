/**
 * Migration to create ai_analyses table
 */

exports.up = pgm => {
  pgm.createTable('ai_analyses', {
    id: 'id',
    response_id: {
      type: 'integer',
      notNull: true,
      references: 'responses',
      onDelete: 'CASCADE'
    },
    prompt: { type: 'text', notNull: true },
    analysis: { type: 'text', notNull: true },
    recommendations: { type: 'text' },
    risk_assessment: { type: 'text' },
    model_used: { type: 'varchar(100)', notNull: true },
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
  pgm.createIndex('ai_analyses', 'response_id');
  pgm.createIndex('ai_analyses', 'created_by_id');
  pgm.createIndex('ai_analyses', 'model_used');
  
  // Add full-text search index
  pgm.createIndex('ai_analyses', ['analysis', 'recommendations', 'risk_assessment'], {
    method: 'GIN',
    name: 'ai_analyses_search_idx',
    expression: 'to_tsvector(\'english\', analysis || \' \' || COALESCE(recommendations, \'\') || \' \' || COALESCE(risk_assessment, \'\'))'
  });
};

exports.down = pgm => {
  pgm.dropTable('ai_analyses');
};
