/* Order of dropping tables is important because of foreign key checks */
drop table if exists tagged_by, note, tag, user_account;

create or replace function update_modified_timestamp ()
  returns trigger
  as $$
begin
  NEW.modified = now();
  return NEW;
end;
$$
language 'plpgsql';

create table user_account (
  id serial primary key,
  username text not null check (username <> ''),
  email text not null check (email <> ''),
  password text not null check (password <> ''),
  role text not null check (role <> '') default 'user',
  active boolean not null default true,
  created timestamptz not null default now(),
  modified timestamptz not null default now(),
  unique (username),
  unique (email)
);

create trigger update_user_account_timestamp
  before update on user_account for each row
  execute procedure update_modified_timestamp ();

create table note (
  id serial primary key,
  user_id int not null,
  title text,
  content text,
  created timestamptz not null default now(),
  modified timestamptz not null default now(),
  tsv tsvector not null,
  foreign key (user_id) references user_account (id) on delete cascade
);

create trigger update_note_timestamp
  before update on note for each row
  execute procedure update_modified_timestamp ();


create index note_tsv_index on note using gin (tsv);


/* tsvector_update_trigger skips any NULL values, so coalesce is not required */
create trigger update_note_content_tsv
  before insert or update on note for each row
  execute procedure tsvector_update_trigger (tsv, 'pg_catalog.english', title, content);

create table tag (
  id serial primary key,
  user_id int not null,
  tag_name text not null,
  created timestamptz not null default now(),
  modified timestamptz not null default now(),
  foreign key (user_id) references user_account (id) on delete cascade,
  unique (user_id, tag_name)
);

create trigger update_tag_timestamp
  before update on tag for each row
  execute procedure update_modified_timestamp ();


/* Relationship table only has created column, because entries can be removed, but not modified */
create table tagged_by (
  note_id int not null,
  tag_id int not null,
  created timestamptz not null default now(),
  foreign key (note_id) references note (id) on delete cascade,
  foreign key (tag_id) references tag (id) on delete cascade,
  unique (note_id, tag_id)
);

