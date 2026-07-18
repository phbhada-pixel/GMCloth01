CREATE OR REPLACE FUNCTION get_revenue_metrics(p_shop_id text)
RETURNS TABLE (
  daily_revenue numeric,
  weekly_revenue numeric,
  monthly_revenue numeric,
  yearly_revenue numeric
)
LANGUAGE plpgsql
AS $$
DECLARE
  today_start bigint := (extract(epoch from date_trunc('day', now())) * 1000)::bigint;
  week_start bigint := (extract(epoch from date_trunc('week', now())) * 1000)::bigint;
  month_start bigint := (extract(epoch from date_trunc('month', now())) * 1000)::bigint;
  year_start bigint := (extract(epoch from date_trunc('year', now())) * 1000)::bigint;
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN date >= today_start THEN grand_total ELSE 0 END), 0) AS daily_revenue,
    COALESCE(SUM(CASE WHEN date >= week_start THEN grand_total ELSE 0 END), 0) AS weekly_revenue,
    COALESCE(SUM(CASE WHEN date >= month_start THEN grand_total ELSE 0 END), 0) AS monthly_revenue,
    COALESCE(SUM(CASE WHEN date >= year_start THEN grand_total ELSE 0 END), 0) AS yearly_revenue
  FROM t_sales
  WHERE shop_id = p_shop_id;
END;
$$;
