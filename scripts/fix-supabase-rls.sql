-- Supabase Security Advisor Fix: Enable Row Level Security (RLS)
-- 適用於專案: tarot-divination (jiorbrohmdoiuteqeifc)
-- 解除問題: rls_disabled_in_public, sensitive_columns_exposed
-- 
-- 使用方式:
-- 複製以下 SQL 到 Supabase Dashboard -> SQL Editor (https://supabase.com/dashboard/project/jiorbrohmdoiuteqeifc/sql/new) 貼上並執行 (Run)

-- 1. 一次性為 public schema 底下的所有資料表啟用 Row Level Security (RLS)
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP 
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename); 
    END LOOP; 
END $$;

-- 2. 亦可單獨針對已知的資料表逐一啟用 RLS
ALTER TABLE IF EXISTS public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."DivinationRecord" ENABLE ROW LEVEL SECURITY;
