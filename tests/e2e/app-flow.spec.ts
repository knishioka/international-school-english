import { test, expect } from './fixtures';

test.describe('基本的なアプリフロー', () => {
  test('ホームページが正常に表示される', async ({ page }) => {
    // フィクスチャによりログイン済み状態でホームページにいる
    await expect(page.locator('h1')).toContainText('こんにちは, テスト!');

    // ゲームカードが表示される
    await expect(page.getByText('たんごカード')).toBeVisible();

    // 文章練習カードが表示される（漢字レベルによって表示が変わる）
    await expect(
      page.locator('text=/ぶんしょうれんしゅう|文しょうれんしゅう|文章練習/'),
    ).toBeVisible();
  });
});
