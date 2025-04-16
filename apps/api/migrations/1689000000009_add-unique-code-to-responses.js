/**
 * Migration to add unique_code column to responses table
 */

exports.up = pgm => {
  // Add unique_code column if it doesn't exist
  pgm.addColumns('responses', {
    unique_code: {
      type: 'varchar(20)',
      unique: true
    }
  }, {
    ifNotExists: true
  });
  
  // Create index on unique_code
  pgm.createIndex('responses', 'unique_code', {
    unique: true,
    ifNotExists: true
  });
  
  // Create function to generate unique code
  pgm.createFunction(
    'generate_unique_code',
    [],
    {
      returns: 'varchar',
      language: 'plpgsql'
    },
    `
    DECLARE
      code varchar;
      done boolean;
    BEGIN
      done := false;
      WHILE NOT done LOOP
        -- Generate random 8-character code
        code := upper(substring(md5(random()::text) from 1 for 8));
        
        -- Check if code already exists
        done := NOT EXISTS(SELECT 1 FROM responses WHERE unique_code = code);
      END LOOP;
      
      RETURN code;
    END;
    `
  );
  
  // Update existing responses with unique codes
  pgm.sql(`
    UPDATE responses
    SET unique_code = generate_unique_code()
    WHERE unique_code IS NULL
  `);
  
  // Make unique_code not null
  pgm.alterColumn('responses', 'unique_code', {
    notNull: true
  });
  
  // Create trigger to automatically generate unique code for new responses
  pgm.createTrigger(
    'responses',
    'generate_unique_code_trigger',
    {
      when: 'BEFORE',
      operation: 'INSERT',
      level: 'ROW',
      language: 'plpgsql',
      replace: true
    },
    `
    BEGIN
      IF NEW.unique_code IS NULL THEN
        NEW.unique_code := generate_unique_code();
      END IF;
      RETURN NEW;
    END;
    `
  );
};

exports.down = pgm => {
  // Drop trigger
  pgm.dropTrigger('responses', 'generate_unique_code_trigger', {
    ifExists: true
  });
  
  // Drop function
  pgm.dropFunction('generate_unique_code', [], {
    ifExists: true
  });
  
  // Drop column
  pgm.dropColumn('responses', 'unique_code', {
    ifExists: true
  });
};
