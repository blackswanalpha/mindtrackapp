/* 
 * Migration to create the responses table
 */
exports.up = pgm => {
  pgm.createTable('responses', {
    id: 'id',
    questionnaire_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'questionnaires(id)',
      onDelete: 'CASCADE'
    },
    user_id: { 
      type: 'integer', 
      references: 'users(id)'
    },
    patient_identifier: { type: 'varchar(255)' },
    patient_name: { type: 'varchar(255)' },
    patient_email: { type: 'varchar(255)' },
    patient_age: { type: 'integer' },
    patient_gender: { type: 'varchar(50)' },
    score: { type: 'integer' },
    risk_level: { type: 'varchar(50)' },
    flagged_for_review: { 
      type: 'boolean', 
      notNull: true, 
      default: false 
    },
    completion_time: { type: 'integer' },
    completed_at: { type: 'timestamp' },
    organization_id: { 
      type: 'integer', 
      references: 'organizations(id)'
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
  pgm.createIndex('responses', 'questionnaire_id');
  pgm.createIndex('responses', 'user_id');
  pgm.createIndex('responses', 'organization_id');
  pgm.createIndex('responses', 'patient_identifier');
  pgm.createIndex('responses', 'patient_email');
  pgm.createIndex('responses', 'risk_level');
  pgm.createIndex('responses', 'completed_at');
};

exports.down = pgm => {
  pgm.dropTable('responses');
};
