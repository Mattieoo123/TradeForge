-- TradeForge v8: private per-user cloud storage.
-- Paste this entire script into Supabase > SQL Editor > New query > Run.
-- IMPORTANT: Use the anon/publishable key in the app, NEVER the service_role/secret key.
create table if not exists public.tradeforge_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  version bigint not null default 1 check (version >= 1),
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.tradeforge_state enable row level security;
revoke all on public.tradeforge_state from anon;
grant select, insert, update on public.tradeforge_state to authenticated;

drop policy if exists "TradeForge users read only their data" on public.tradeforge_state;
create policy "TradeForge users read only their data"
 on public.tradeforge_state for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "TradeForge users create only their data" on public.tradeforge_state;
create policy "TradeForge users create only their data"
 on public.tradeforge_state for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "TradeForge users update only their data" on public.tradeforge_state;
create policy "TradeForge users update only their data"
 on public.tradeforge_state for update to authenticated
 using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
