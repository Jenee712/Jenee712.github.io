import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useAppStore } from '@/store/useAppStore';
import { HomePage } from '@/pages/HomePage';
import { EnglishPage } from '@/pages/EnglishPage';
import { EnglishLessonPage } from '@/pages/EnglishLessonPage';
import { PictureBookLibrary } from '@/pages/PictureBookLibrary';
import { PictureBookReader } from '@/pages/PictureBookReader';
import { MathPage } from '@/pages/MathPage';
import { MathLessonPage } from '@/pages/MathLessonPage';
import { ChinesePage } from '@/pages/ChinesePage';
import { ChineseLessonPage } from '@/pages/ChineseLessonPage';
import { BattlePage } from '@/pages/BattlePage';
import { LessonResultPage } from '@/pages/LessonResultPage';
import { ReviewGardenPage } from '@/pages/ReviewGardenPage';
import { RewardPage } from '@/pages/RewardPage';
import { ForestBoardPage } from '@/pages/ForestBoardPage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { GrowthAlbumPage } from '@/pages/GrowthAlbumPage';
import { ParentPinPage } from '@/pages/ParentPinPage';
import { ParentCenterPage } from '@/pages/ParentCenterPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export default function App() {
  useEffect(() => {
    // 啟動時從「服務端」拉取當日計劃（含薄弱點複習），保證內容每日自動更新
    useAppStore.getState().refresh();
  }, []);
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/english" element={<EnglishPage />} />
        <Route path="/english/lesson/:lessonId" element={<EnglishLessonPage />} />
        <Route path="/english/books" element={<PictureBookLibrary />} />
        <Route path="/english/book/:bookId" element={<PictureBookReader />} />
        <Route path="/math" element={<MathPage />} />
        <Route path="/math/lesson/:lessonId" element={<MathLessonPage />} />
        <Route path="/chinese" element={<ChinesePage />} />
        <Route path="/chinese/lesson/:lessonId" element={<ChineseLessonPage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/lesson/result/:taskId" element={<LessonResultPage />} />
        <Route path="/review" element={<ReviewGardenPage />} />
        <Route path="/rewards" element={<RewardPage />} />
        <Route path="/board" element={<ForestBoardPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/album" element={<GrowthAlbumPage />} />
        <Route path="/parent" element={<ParentPinPage />} />
        <Route path="/parent/center" element={<ParentCenterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
