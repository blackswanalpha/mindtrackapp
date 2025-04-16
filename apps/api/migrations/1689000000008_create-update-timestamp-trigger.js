/**
 * Migration to create trigger for updating updated_at timestamp
 */

exports.up = pgm => {
  // Create function to update timestamp
  pgm.createFunction(
    'update_timestamp',
    [],
    {
      returns: 'trigger',
      language: 'plpgsql'
    },
    `
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    `
  );
  
  // Create triggers for all tables
  const tables = [
    'users',
    'organizations',
    'organization_members',
    'questionnaires',
    'questions',
    'responses',
    'answers',
    'ai_analyses',
    'scoring_configs'
  ];
  
  tables.forEach(table => {
    pgm.createTrigger(
      table,
      'update_timestamp_trigger',
      {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_timestamp'
      }
    );
  });
};

exports.down = pgm => {
  // Drop triggers
  const tables = [
    'users',
    'organizations',
    'organization_members',
    'questionnaires',
    'questions',
    'responses',
    'answers',
    'ai_analyses',
    'scoring_configs'
  ];
  
  tables.forEach(table => {
    pgm.dropTrigger(table, 'update_timestamp_trigger');
  });
  
  // Drop function
  pgm.dropFunction('update_timestamp', []);
};
