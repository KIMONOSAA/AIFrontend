import React, { useState, useEffect } from 'react';
import { Card, Radio, Button, Typography, Space, Progress, Layout, message, Modal } from 'antd';
import { LeftOutlined, RightOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useParams, useLocation } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Header, Content, Sider } = Layout;
import { listQuestionDataByPage, addQuestionResult, addQuestionResultOverall } from '@/services/practice/questionController';

interface Question {
  id: string;
  subjects: string;
  subjectsTitle: string;
  subjectsResult: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface AnswerData {
  questionId: string;
  selectedAnswer: string;
}

export default function ImprovedPCExamPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [correctAnswers, setCorrectAnswers] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [totalQuestions, setTotalQuestions] = useState(0);
  const { teacherId } = useParams();
  const location = useLocation();
  const { subjects, courseId } = location.state || {};
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [practiceId, setPracticeId] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);

  const fetchAllData = async () => {
    try {
      const response = await listQuestionDataByPage({
        current: 1,
        pageSize: 10,
        subjects: subjects,
        teacherId: Number(teacherId),
        qualifications: "高中",
        courseId: Number(courseId),
        sortField: "",
        recordId: practiceId,
        sortOrder: "",
      });
      if (response.code === 0) {
        setAllQuestions(response.data.questions.records);
        setTotalQuestions(Math.min(response.data.questions.total, 10));
        setPracticeId(response.data.record || 0);
      } else {
        console.error("获取问题数据失败:", response.message);
      }
    } catch (error) {
      console.error("获取问题数据时出错:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1 || examEnded) {
          clearInterval(timer);
          if (prevTime <= 1 && !submitted) {
            handleSubmitAll();
          }
          return 0;
        }
        if (prevTime === 5 * 60 && !submitted) {
          message.warning('还有5分钟练习结束');
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examEnded]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    setQuestions(allQuestions.slice(startIndex, endIndex));
  }, [currentPage, allQuestions]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (!submitted) {
      setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
    }
  };

  const submitAnswers = async (answers: AnswerData[]) => {
    if (submitted) return;
    try {
      const response = await addQuestionResult({
        question: answers.map(answer => ({
          id: Number(answer.questionId),
          value: answer.selectedAnswer
        })),
        subjects: subjects,
        practiceId: practiceId,
        teachplanId: Number(teacherId),
        courseId: Number(courseId)
      });

      if (response.code === 0) {
        message.success('答案提交成功');
      } else {
        message.error('答案提交失败');
      }
    } catch (error) {
      console.error("提交答案时出错:", error);
      message.error('答案提交失败');
    }
  };

  const handleNextPage = async () => {
    if (submitted) return;
    const currentAnswers = questions
      .map(q => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[q.id] || ''
      }))
      .filter(a => a.selectedAnswer !== '');

    await submitAnswers(currentAnswers);

    if (currentPage < Math.ceil(totalQuestions / 5)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (submitted) return;
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitAll = async () => {
    if (submitted) return;
    try {
      const response = await addQuestionResultOverall({
        subjects: subjects,
        practiceId: practiceId,
        courseId: Number(courseId),
        teachplanId: Number(teacherId),
      });

      if (response.code === 0) {
        message.success('所有答案已提交');
        setSubmitted(true);
        setExamEnded(true);
        const newCorrectAnswers = allQuestions.reduce((acc, question) => {
          acc[question.id] = question.subjectsResult;
          return acc;
        }, {} as { [key: string]: string });
        setCorrectAnswers(newCorrectAnswers);
      } else {
        message.error('提交所有答案失败');
      }
    } catch (error) {
      console.error("提交所有答案时出错:", error);
      message.error('提交所有答案失败');
    }
  };

  const isLastPage = currentPage === Math.ceil(totalQuestions / 5);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <Title level={2}>{subjects}考试</Title>
      </Header>
      <Layout>
        <Sider width={300} style={{ background: '#fff', padding: '24px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Paragraph strong>
              {examEnded ? '练习结束' : `剩余时间: ${formatTime(timeLeft)}`}
            </Paragraph>
            <Progress
              percent={Math.round((timeLeft / (45 * 60)) * 100)}
              showInfo={false}
              status="active"
            />
            <Title level={4}>问题导航</Title>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Array.from({ length: totalQuestions }, (_, index) => (
                <Button
                  key={index}
                  type={selectedAnswers[allQuestions[index]?.id] ? 'primary' : 'default'}
                  onClick={() => setCurrentPage(Math.ceil((index + 1) / 5))}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </Space>
        </Sider>
        <Content style={{ padding: '24px', background: '#fff' }}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {questions.map((question, index) => (
                <div key={question.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Paragraph>{`${((currentPage - 1) * 5) + (index + 1)}、${question.subjectsTitle}`}{submitted && (
                      selectedAnswers[question.id] === correctAnswers[question.id] ? (
                        <CheckOutlined style={{ color: 'green', marginLeft: '10px' }} />
                      ) : (
                        <CloseOutlined style={{ color: 'red', marginLeft: '10px' }} />
                      )
                    )}</Paragraph>

                    <Radio.Group
                      onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                      value={selectedAnswers[question.id]}
                      disabled={submitted}
                    >
                      <Space direction="vertical">
                        <Radio value="A">{`A. ${question.optionA}`}</Radio>
                        <Radio value="B">{`B. ${question.optionB}`}</Radio>
                        <Radio value="C">{`C. ${question.optionC}`}</Radio>
                        <Radio value="D">{`D. ${question.optionD}`}</Radio>
                      </Space>
                    </Radio.Group>
                    {submitted && (
                      <div style={{ marginLeft: '0px' }}>
                        {selectedAnswers[question.id] === correctAnswers[question.id] ? (
                          <Paragraph style={{ color: 'blue', margin: 0 }}>
                            你的答案: {selectedAnswers[question.id]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            正确答案: {correctAnswers[question.id]}
                          </Paragraph>
                        ) : (
                          <Paragraph type="danger">
                            你的答案: {selectedAnswers[question.id]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            正确答案: {correctAnswers[question.id]}
                          </Paragraph>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Space>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                icon={<LeftOutlined />}
                onClick={() => !submitted && handlePreviousPage()}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              {isLastPage ? (
                <Button
                  type="primary"
                  onClick={() => {
                    Modal.confirm({
                      title: '确认提交全部?',
                      content: '你确定要提交所有内容吗？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk() {
                        handleSubmitAll();
                      },
                      onCancel() {
                        console.log('用户取消了提交');
                      },
                    });
                  }}
                  disabled={submitted}
                >
                  提交全部
                </Button>
              ) : (
                <Button
                  icon={<RightOutlined />}
                  onClick={() => !submitted && handleNextPage()}
                >
                  下一页
                </Button>
              )}
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}