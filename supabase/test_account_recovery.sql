-- 問道長生測試版：獨立永久恢復碼、雲端備份與裝置移轉
create table if not exists public.test_account_recovery_backups (
  user_id uuid primary key references auth.users(id) on delete cascade,
  recovery_hash text not null unique check (recovery_hash ~ '^[0-9a-f]{64}$'),
  save_data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.test_account_recovery_backups enable row level security;
revoke all on public.test_account_recovery_backups from anon, authenticated;

create or replace function public.save_test_recovery_backup(p_recovery_hash text,p_save_data jsonb)
returns boolean language plpgsql security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  if p_recovery_hash !~ '^[0-9a-f]{64}$' or p_save_data is null or jsonb_typeof(p_save_data) <> 'object' then raise exception 'invalid recovery backup'; end if;
  insert into public.test_account_recovery_backups(user_id,recovery_hash,save_data,updated_at)
  values ((select auth.uid()),p_recovery_hash,p_save_data,now())
  on conflict (user_id) do update set recovery_hash=excluded.recovery_hash,save_data=excluded.save_data,updated_at=now();
  return true;
end $$;

create or replace function public.check_test_recovery_owner(p_recovery_hash text)
returns boolean language sql security definer set search_path = '' stable
as $$
  select exists(
    select 1 from public.test_account_recovery_backups
    where user_id=(select auth.uid()) and recovery_hash=p_recovery_hash
  );
$$;

create or replace function public.recover_test_account(p_recovery_hash text)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare old_user uuid; new_user uuid := (select auth.uid()); recovered_save jsonb;
begin
  if new_user is null then raise exception 'authentication required'; end if;
  select user_id,save_data into old_user,recovered_save
  from public.test_account_recovery_backups where recovery_hash=p_recovery_hash for update;
  if old_user is null then raise exception 'recovery code not found'; end if;
  if old_user = new_user then return recovered_save; end if;

  delete from public.player_rankings
  where user_id=new_user and game_version like '20260902-49%';
  delete from public.arena_daily where user_id=new_user and channel='test';
  delete from public.arena_rewards where user_id=new_user and channel='test';
  delete from public.arena_matches where channel='test' and (challenger_id=new_user or defender_id=new_user);
  delete from public.arena_profiles where user_id=new_user and channel='test';
  delete from private.player_state_events where user_id=new_user and channel='test';
  delete from private.player_states where user_id=new_user and channel='test';
  update public.player_rankings set user_id=new_user
  where user_id=old_user and game_version like '20260902-49%';
  update public.arena_profiles set user_id=new_user where user_id=old_user and channel='test';
  update public.arena_daily set user_id=new_user where user_id=old_user and channel='test';
  update public.arena_rewards set user_id=new_user where user_id=old_user and channel='test';
  update public.arena_matches set challenger_id=new_user where challenger_id=old_user and channel='test';
  update public.arena_matches set defender_id=new_user where defender_id=old_user and channel='test';
  update private.arena_name_owners set user_id=new_user where user_id=old_user and channel='test';
  update private.player_states set user_id=new_user where user_id=old_user and channel='test';
  update private.player_state_events set user_id=new_user where user_id=old_user and channel='test';
  delete from public.test_account_recovery_backups where user_id=new_user;
  update public.test_account_recovery_backups set user_id=new_user,updated_at=now() where user_id=old_user;
  return recovered_save;
end $$;

create or replace function public.delete_test_recovery_backup()
returns boolean language plpgsql security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is null then raise exception 'authentication required'; end if;
  delete from public.test_account_recovery_backups where user_id=(select auth.uid());
  return true;
end $$;

revoke execute on function public.save_test_recovery_backup(text,jsonb) from public,anon;
revoke execute on function public.check_test_recovery_owner(text) from public,anon;
revoke execute on function public.recover_test_account(text) from public,anon;
revoke execute on function public.delete_test_recovery_backup() from public,anon;
grant execute on function public.save_test_recovery_backup(text,jsonb) to authenticated;
grant execute on function public.check_test_recovery_owner(text) to authenticated;
grant execute on function public.recover_test_account(text) to authenticated;
grant execute on function public.delete_test_recovery_backup() to authenticated;
