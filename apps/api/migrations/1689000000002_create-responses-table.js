/**
 * Migration to create responses table
 */

exports.up = pgm => {
  pgm.createTable('responses', {
    id: 'id',
    questionnaire_id: {
      type: 'integer',
      notNull: true,
      references: 'questionnaires',
      onDelete: 'CASCADE'
    },
    user_id: {
      type: 'integer',
      references: 'users',
      onDelete: 'SET NULL'
    },
    patient_identifier: { type: 'varchar(255)' },
    patient_name: { type: 'varchar(255)' },
    patient_email: { type: 'varchar(255)' },
    patient_age: { type: 'integer' },
    patient_gender: { type: 'varchar(50)' },
    unique_code: { type: 'varchar(20)', notNull: true, unique: true },
    score: { type: 'integer' },
    risk_level: {
      type: 'varchar(20)',
      check: "risk_level IN ('low', 'medium', 'high')"
    },
    flagged_for_review: { type: 'boolean', default: false },
    organization_id: {
      type: 'integer',
      references: 'organizations',
      onDelete: 'SET NULL'
    },
    completed_at: { type: 'timestamp' },
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
  pgm.createIndex('responses', 'questionnaire_id');
  pgm.createIndex('responses', 'user_id');
  pgm.createIndex('responses', 'organization_id');
  pgm.createIndex('responses', 'patient_identifier');
  pgm.createIndex('responses', 'patient_email');
  pgm.createIndex('responses', 'risk_level');
  pgm.createIndex('responses', 'flagged_for_review');
  pgm.createIndex('responses', 'completed_at');
  pgm.createIndex('responses', 'unique_code', { unique: true });
};

exports.down = pgm => {
  pgm.dropTable('responses');
};
