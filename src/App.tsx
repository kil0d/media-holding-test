import "./App.css";
import { Card, Typography, Row, Space } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchNews } from "./store/newsSlice";

const { Text, Paragraph, Link } = Typography;

function App() {
  const dispatch = useAppDispatch();
  const { items, loading, hasMore, page } = useAppSelector((state) => state.news);

  const observer = useRef<IntersectionObserver | null>(null);

  const triggerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          dispatch(fetchNews(page));
        }
      }, {
        rootMargin: '100px'
      });

      if (node) observer.current.observe(node);
    },
    [dispatch, page, loading, hasMore]
  );

  const truncate = (text: string, max = 250) => {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    return cleaned.length > max ? cleaned.slice(0, max) + "..." : cleaned;
  };

  return (
    <div className="news-blog">
      {items.map((item, index) => {
        const isTenth = (index + 1) % 10 === 0 || index === items.length - 1;

        return (
          <Card
            key={item.id}
            ref={isTenth ? triggerRef : undefined}
            style={{
              maxWidth: 600,
              margin: "0 auto",
              marginBottom: 20,
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Row justify="space-between" align="top">
              <Space align="start">
                <div>
                  <Text style={{ fontSize: "20px" }} strong>{item.title}</Text>
                </div>
              </Space>
            </Row>

            <Paragraph style={{ marginTop: 16 }}>
              {truncate(item.body)}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: 8 }}>
                {item.tags.map(tag => (
                  <Link key={tag}>#{tag}</Link>
                ))}
              </div>
            </Paragraph>

            <Text type="secondary" style={{ fontSize: 12 }}>
              <Text strong>{item.views}</Text> Views
            </Text>

            <div style={{ borderTop: "1px solid #f0f0f0", marginTop: 16, paddingTop: 12 }}>
              <Row>
                <Space>
                  <LikeOutlined />
                  <Text strong>{item.reactions.likes}</Text>
                  <DislikeOutlined />
                  <Text strong>{item.reactions.dislikes}</Text>
                </Space>
              </Row>
            </div>
          </Card>
        );
      })}
      {/* ⬇️ Наблюдаем пустой div, если нет ещё 10-го элемента */}
      {items.length < 10 && (
        <div ref={triggerRef} style={{ height: 1 }} />
      )}
    </div>
  );
}

export default App;
