-- Sample data from Faker.js

create table employee (
    id serial primary key,
    first_name text,
    last_name text,
    job_title text,
    tsv tsvector
);

create index employee_tsv_index on employee using gin (tsv);

create trigger update_employee_tsv
    before insert or update on employee for each row
    execute procedure tsvector_update_trigger (tsv, 'pg_catalog.english', job_title);

insert into employee (first_name, last_name, job_title)
values  ('Aileen', 'Witting', 'Future Brand Assistant'),
        ('Grayce', 'Tillman', 'Human Accounts Technician'),
        ('Gisselle', 'Lueilwitz', 'Forward Interactions Planner'),
        ('Lenora', 'Sipes', 'International Applications Orchestrator'),
        ('Marjolaine', 'Sporer', 'Dynamic Mobility Orchestrator'),
        ('Tremayne', 'Kilback', 'International Web Coordinator'),
        ('Lula', 'Rau', 'Senior Configuration Director'),
        ('Aileen', 'Shields', 'District Communications Coordinator'), 
        ('Israel', 'Sporer', 'Product Quality Consultant'),
        ('Lawson', 'Jaskolski', 'Forward Optimization Director');

create table client_account (
  id serial primary key,
  employee_id int not null,
  account_name text,
  foreign key (employee_id) references employee (id) on delete cascade
);

insert into client_account (employee_id, account_name)
values  (2, 'Larkin - Bode'),
        (2, 'Kris - Pagac'),
        (2, 'Champlin, Koelpin and Morar'),
        (5, 'Abshire - Smith'),
        (5, 'Keebler - Rohan'),
        (5, 'Goodwin Inc'),
        (10, 'Hane - Bernier'),
        (10, 'Sanford, Weber and McKenzie');
        