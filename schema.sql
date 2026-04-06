-- AKASHA AI Schema
CREATE SCHEMA IF NOT EXISTS akasha_ai;

-- Profiles
CREATE TABLE IF NOT EXISTS akasha_ai.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  pseudo TEXT UNIQUE,
  bio TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_title TEXT DEFAULT 'Explorateur',
  plan TEXT DEFAULT 'free',
  plan_tier TEXT DEFAULT 'essential',
  role TEXT DEFAULT 'user',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_use_case TEXT,
  onboarding_level TEXT,
  interests TEXT[] DEFAULT '{}',
  preferred_language TEXT DEFAULT 'fr',
  accent_color TEXT DEFAULT 'cyan',
  tutorial_completed BOOLEAN DEFAULT false,
  wallet_balance NUMERIC(10,2) DEFAULT 0,
  referral_code TEXT UNIQUE,
  daily_questions INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  credits INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Conversations
CREATE TABLE IF NOT EXISTS akasha_ai.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  title TEXT,
  model TEXT DEFAULT 'claude-sonnet-4',
  is_favorite BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS akasha_ai.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES akasha_ai.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  model TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Usage daily
CREATE TABLE IF NOT EXISTS akasha_ai.usage_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  chat_count INTEGER DEFAULT 0,
  image_count INTEGER DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  audio_count INTEGER DEFAULT 0,
  code_count INTEGER DEFAULT 0,
  api_count INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Agents
CREATE TABLE IF NOT EXISTS akasha_ai.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  system_prompt TEXT NOT NULL,
  model TEXT DEFAULT 'claude-sonnet-4',
  triggers JSONB,
  is_active BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  price NUMERIC(10,2) DEFAULT 0,
  installs INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Agent installs
CREATE TABLE IF NOT EXISTS akasha_ai.agent_installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES akasha_ai.agents(id) ON DELETE CASCADE,
  installed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- Agent reviews
CREATE TABLE IF NOT EXISTS akasha_ai.agent_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES akasha_ai.agents(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- Generations
CREATE TABLE IF NOT EXISTS akasha_ai.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  model TEXT,
  result_url TEXT,
  result_text TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workflows
CREATE TABLE IF NOT EXISTS akasha_ai.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'paused',
  last_run TIMESTAMPTZ,
  cron_schedule TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Collab spaces
CREATE TABLE IF NOT EXISTS akasha_ai.collab_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS akasha_ai.collab_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES akasha_ai.collab_spaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'editor',
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(space_id, user_id)
);

-- Badges
CREATE TABLE IF NOT EXISTS akasha_ai.badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  condition_type TEXT,
  condition_value INTEGER
);

CREATE TABLE IF NOT EXISTS akasha_ai.user_badges (
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES akasha_ai.badges(id),
  earned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

-- XP log
CREATE TABLE IF NOT EXISTS akasha_ai.xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  xp_earned INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Streaks
CREATE TABLE IF NOT EXISTS akasha_ai.streaks (
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE
);

-- API keys
CREATE TABLE IF NOT EXISTS akasha_ai.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  name TEXT DEFAULT 'Default',
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS akasha_ai.api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES akasha_ai.api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  status INTEGER,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS akasha_ai.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  icon TEXT,
  type TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Wallets
CREATE TABLE IF NOT EXISTS akasha_ai.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE UNIQUE,
  balance NUMERIC(10,2) DEFAULT 0,
  total_earned NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS akasha_ai.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES akasha_ai.wallets(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS akasha_ai.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES akasha_ai.profiles(id) ON DELETE CASCADE,
  stripe_payment_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON akasha_ai.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON akasha_ai.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_usage_daily_user_date ON akasha_ai.usage_daily(user_id, date);
CREATE INDEX IF NOT EXISTS idx_agents_creator_id ON akasha_ai.agents(creator_id);
CREATE INDEX IF NOT EXISTS idx_agents_is_public ON akasha_ai.agents(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON akasha_ai.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_user_id ON akasha_ai.xp_log(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON akasha_ai.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON akasha_ai.profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON akasha_ai.profiles(stripe_customer_id);

-- RLS
ALTER TABLE akasha_ai.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.usage_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.agent_installs ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.agent_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.collab_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.collab_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE akasha_ai.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_profile' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_profile ON akasha_ai.profiles FOR ALL USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_conversations' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_conversations ON akasha_ai.conversations FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_messages' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_messages ON akasha_ai.messages FOR ALL USING (conversation_id IN (SELECT id FROM akasha_ai.conversations WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_usage' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_usage ON akasha_ai.usage_daily FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_agents' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_agents ON akasha_ai.agents FOR ALL USING (auth.uid() = creator_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_see_public_agents' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_see_public_agents ON akasha_ai.agents FOR SELECT USING (is_public = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_installs' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_installs ON akasha_ai.agent_installs FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_reviews' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_reviews ON akasha_ai.agent_reviews FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_see_reviews' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_see_reviews ON akasha_ai.agent_reviews FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_generations' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_generations ON akasha_ai.generations FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_workflows' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_workflows ON akasha_ai.workflows FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_collab_spaces' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_collab_spaces ON akasha_ai.collab_spaces FOR ALL USING (auth.uid() = owner_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_badges' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_badges ON akasha_ai.user_badges FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_xp' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_xp ON akasha_ai.xp_log FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_streaks' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_streaks ON akasha_ai.streaks FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_api_keys' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_api_keys ON akasha_ai.api_keys FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_notifications' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_notifications ON akasha_ai.notifications FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_wallets' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_wallets ON akasha_ai.wallets FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_wallet_txns' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_wallet_txns ON akasha_ai.wallet_transactions FOR ALL USING (wallet_id IN (SELECT id FROM akasha_ai.wallets WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_own_payments' AND schemaname = 'akasha_ai') THEN
    CREATE POLICY users_own_payments ON akasha_ai.payments FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION akasha_ai.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO akasha_ai.profiles (id, email, display_name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    lower(substr(md5(random()::text), 1, 8))
  );
  INSERT INTO akasha_ai.wallets (user_id) VALUES (NEW.id);
  INSERT INTO akasha_ai.streaks (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_akasha ON auth.users;
CREATE TRIGGER on_auth_user_created_akasha
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION akasha_ai.handle_new_user();

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION akasha_ai.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_profiles_timestamp BEFORE UPDATE ON akasha_ai.profiles FOR EACH ROW EXECUTE FUNCTION akasha_ai.update_updated_at();
CREATE OR REPLACE TRIGGER update_conversations_timestamp BEFORE UPDATE ON akasha_ai.conversations FOR EACH ROW EXECUTE FUNCTION akasha_ai.update_updated_at();
CREATE OR REPLACE TRIGGER update_agents_timestamp BEFORE UPDATE ON akasha_ai.agents FOR EACH ROW EXECUTE FUNCTION akasha_ai.update_updated_at();

-- Seed super admin
INSERT INTO akasha_ai.profiles (id, email, display_name, role, plan, plan_tier, credits, daily_questions, xp, level, xp_title)
SELECT id, 'matiss.frasne@gmail.com', 'Tissma', 'super_admin', 'complete', 'max', 999999, 999999, 99999, 100, 'Akashique'
FROM auth.users WHERE email = 'matiss.frasne@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'super_admin', plan = 'complete', plan_tier = 'max', credits = 999999, daily_questions = 999999;

-- Seed badges
INSERT INTO akasha_ai.badges (id, name, description, icon, xp_reward, condition_type, condition_value) VALUES
  ('first_step', 'Premier Pas', 'Premiere utilisation', '🌱', 10, 'count', 1),
  ('streak_7', 'Flamme', '7 jours consecutifs', '🔥', 50, 'streak', 7),
  ('streak_30', 'Diamant', '30 jours consecutifs', '💎', 200, 'streak', 30),
  ('artist', 'Artiste', '100 images generees', '🎨', 100, 'count', 100),
  ('director', 'Realisateur', '50 videos generees', '🎬', 150, 'count', 50),
  ('composer', 'Compositeur', '25 musiques generees', '🎵', 100, 'count', 25),
  ('creator', 'Createur', 'Premier agent cree', '🤖', 25, 'count', 1),
  ('seller', 'Vendeur', 'Premier agent vendu', '🏪', 50, 'marketplace', 1),
  ('top_10', 'Top 10', 'Dans le top 10 du classement', '⭐', 500, 'level', 1),
  ('akashique', 'Akashique', 'Niveau 100 atteint', '🌌', 1000, 'level', 100),
  ('connector', 'Connecteur', '10 personnes invitees', '👥', 200, 'count', 10),
  ('beta_tester', 'Beta Testeur', 'Badge exclusif early adopters', '🧪', 100, 'count', 1)
ON CONFLICT (id) DO NOTHING;
