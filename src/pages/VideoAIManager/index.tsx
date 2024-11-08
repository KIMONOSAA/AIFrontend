import React, { useEffect, useRef, useState } from 'react';
import {
  Layout, Menu, Button, Input, Space, Table, Modal, notification, DatePicker, InputRef, TableColumnsType, Cascader, Checkbox, ColorPicker,
  Form,
  Select,
  Upload,
  message,
  UploadFile,
  List,
} from 'antd';
const { Option } = Select;
import { EyeOutlined, InboxOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import VirtualList from 'rc-virtual-list';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import SparkMD5 from 'spark-md5';
import { bigFileController, mediaFilesController } from '@/services/media/index';
import { courseBaseInfoController, courseOpenController, coursePublishController, teachplanController, courseLearnRecordController } from '@/services/course/index';
import { dictionaryController } from '@/services/dictionary/index';
import { userController } from '@/services/auth/index';
import { values } from 'lodash';
import { addAiMasterData } from '@/services/practice/questionController';
import Dragger from 'antd/lib/upload/Dragger';

const { Sider, Content } = Layout;
const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#000',
};

const siderStyle: React.CSSProperties = {
  // marginTop: '10px',
  textAlign: 'center',
  lineHeight: '120px',
  // fontSize: '40px'
};

const layoutStyle: React.CSSProperties = {
  borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
  // maxWidth: '100%',
};

// 视频管理模块开始// 视频管理模块开始
// 视频管理模块开始// 视频管理模块开始
const Video: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [data, setData] = useState<DataType[]>([]);
  // 更新列表
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0); // 存储总记录数

  interface DataType {
    filename: string;  // 文件名字
    fileType: string;  // 类型
    tags: string;      // 标题
    createTime: string; // 上传时间
    auditStatus: string | null; // 审核状态
    fileId: string

  }

  type DataIndex = keyof DataType;

  //更新列表
  const fetchData = async (page: number, size: number) => {
    try {
      const response = await bigFileController.listAiMasterDataByPage({
        current: page,   // 使用传入的页码
        pageSize: size,  // 使用传入的每页条目数
      });
      // console.log('xxx', response);
      const paginationInfo = {
        current: response.data.current,
        pages: response.data.pages,
        size: response.data.size,
        total: response.data.total,
      };

      setTotal(paginationInfo.total); // 设置总记录数
      const formattedData = response.data.records.map(item => {
        const createTime = new Date(item.createTime); // 假设 item.createTime 是一个有效的日期字符串或时间戳  
        // 格式化为 "YYYY-MM-DD HH:mm:ss" 格式  
        const formattedTime = `${createTime.getFullYear()}-${String(createTime.getMonth() + 1).padStart(2, '0')}-${String(createTime.getDate()).padStart(2, '0')} ${String(createTime.getHours()).padStart(2, '0')}:${String(createTime.getMinutes()).padStart(2, '0')}:${String(createTime.getSeconds()).padStart(2, '0')}`;
        // console.log(formattedTime); // 输出格式化后的北京时间
        return {
          filename: item.filename,
          fileType: item.fileType,
          fileId: item.fileId,
          tags: item.tags,
          createTime: formattedTime,
          auditStatus: item.auditStatus || '未审核',
        };
      });
      setData(formattedData);
    } catch (error) {
      console.error('检查文件时出错:', error);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnsType<DataType>[number] => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            滤波器
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            关闭
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  // 渲染表格（主）
  const columns: TableColumnsType<DataType> = [
    {
      title: '文件名字',
      dataIndex: 'filename',
      key: 'filename',
      width: '25%',
      ...getColumnSearchProps('filename'),
    },
    {
      title: '类型',
      dataIndex: 'fileType',
      key: 'fileType',
      width: '15%',
      ...getColumnSearchProps('fileType'),
    },
    {
      title: '标题',
      dataIndex: 'tags',
      key: 'tags',
      width: '15%',
      ...getColumnSearchProps('tags'),
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '15%',
      ...getColumnSearchProps('createTime'),
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      width: '15%',
      ...getColumnSearchProps('auditStatus'),
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handlePreview(record)}>预览</Button>
          <Button type="link" danger onClick={() => handleRemove(a)}>移除</Button>
        </Space>
      ),
    }

  ];

  // 预览按钮的处理函数在线观看视频
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const handlePreview = async (record: DataType) => {
    // console.log('上一个点击', videoUrl);
    // console.log(record);
    const { fileId } = record; // 从record中提取fileId
    const response = await mediaFilesController.getPreviewUrl({ filemd5: fileId });
    console.log('response', response.data);

    // console.log('mediaId',mediaId);
    // setVideoUrl(response.data);
    // const { fileId } = record; // 从record中提取fileId
    // const url = `http://192.168.101.132:9000/video/3/4/342602e471862fd9a4301d6239372e27/342602e471862fd9a4301d6239372e27.mp4`
    setVideoUrl(response.data);
    //  console.log('当前点击:', videoUrl); // 确保 videoUrl 更新后输出
    setPreviewModalOpen(true);
  };

  // 移除按钮的处理函数
  const handleRemove = (record: DataType) => {
    console.log('移除:', record);
    // 在这里实现移除逻辑
  };

  //添加视频
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleAddFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mp4'; // 限制只能选择 MP4 文件
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // 确保文件对象被正确传递
        const newFile = {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)}M`, // 转换为 MB
          progress: 0,
          status: '等待上传',
          id: Date.now(), // 使用时间戳作为唯一 ID
          fileObject: file // 添加文件对象到新文件数据
        };
        setFiles([...files, newFile]);
      }
      input.remove();
    };
    input.click();
  };

  const fileColumns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: any) => `${progress}%`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: { name: string }) => (
        <Button type="primary" onClick={() => handleDelete(record)}>删除</Button>
      ),

    },
  ];

  const handleDelete = (record: { name: string }) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== record.name));
  };

  // 视频上传接口
  const handleUploadVideo = async () => {
    setLoading(true);
    for (const file of files) {
      const targetFile = file.fileObject; // 使用文件对象
      const fileChunkSize = 1024 * 1024 * 5; // 每片大小 5MB
      const chunkCount = Math.ceil(targetFile.size / fileChunkSize);
      const { chunkList, fileMd5 } = await sliceFile(targetFile); // 切片并计算 MD5
      console.log(typeof fileMd5);
      console.log(fileMd5);
      console.log(chunkList);

      try {
        const fileCheck = await bigFileController.checkfile({ fileMd5 });
        // console.log('-----200:', fileCheck);

        if (fileCheck.data) {
          // console.log('文件已存在:', file.name);
          notification.error({
            message: '错误',
            description: `${file.name} 文件已存在，无需重复上传。`,
          });
          continue; // 文件已存在，跳过上传
        }
      } catch (error) {
        console.error('检查文件时出错:', error);
        setLoading(true);
      }
      // 循环处理每个分片

      for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex++) {
        // 检查当前分片是否已上传
        const chunkCheck = await bigFileController.checkchunk({
          fileMd5,
          chunk: chunkIndex + 1,
        });

        if (chunkCheck.data) {
          console.log(`分片 ${chunkIndex + 1} 已上传，跳过...`);
          continue; // 如果分片已上传，跳过
        }
        try {
          // 上传当前分片
          // 创建 FormData 对象
          const formData = new FormData();
          formData.append("fileMd5", fileMd5); // 添加文件的 MD5

          formData.append("chunk", chunkIndex.toString()); // 添加当前分块索引
          formData.append('file', new File([chunkList[chunkIndex]], file.name, { type: file.type })); // 添加当前分片
          console.log(file.name)
          console.log(file.type)
          await bigFileController.uploadchunk(formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log(`分片 ${chunkIndex + 1} 上传成功`);
        } catch (error) {
          console.error('检查文件时出错:', error);
          setLoading(false);
          // 处理错误或重试
        }

        // 更新进度
        const progress = Math.round(((chunkIndex + 1) / chunkCount) * 100);
        setFiles((prev) => {
          const updatedFiles = [...prev];
          const fileToUpdate = updatedFiles.find((f) => f.name === file.name);
          if (fileToUpdate) {
            fileToUpdate.progress = progress;
            fileToUpdate.status = '上传中';
          }
          return updatedFiles;
        });
      }

      // 合并分片
      await bigFileController.mergechunks({
        fileMd5,
        fileName: file.name,
        chunkTotal: chunkCount,
      });

      // 上传完成后的状态更新
      setFiles((prev) => {
        const updatedFiles = [...prev];
        const fileToUpdate = updatedFiles.find((f) => f.name === file.name);
        if (fileToUpdate) {
          fileToUpdate.status = '上传完成';
          notification.info({
            message: '提示',
            description: `${file.name} 上传完成。`,
          });
        } else {
          notification.error({
            message: '错误',
            description: `${file.name} 上传失败，请重试。`,
          });
        }
        return updatedFiles;
      });
    }
    setLoading(false);
  };

  // 切片文件并计算 MD5
  async function sliceFile(targetFile) {
    return new Promise((resolve, reject) => {
      const chunkSize = 5 * 1024 * 1024; // 每片大小 5MB
      const chunkList = [];
      const spark = new SparkMD5.ArrayBuffer();
      const fileReader = new FileReader();
      let currentChunkIndex = 0;

      fileReader.onload = (e) => {
        spark.append(e.target.result);
        chunkList.push(e.target.result);
        currentChunkIndex++;

        if (currentChunkIndex < Math.ceil(targetFile.size / chunkSize)) {
          loadNextChunk();
        } else {
          const fileMd5 = spark.end();
          resolve({ chunkList, fileMd5 });
        }
      };

      fileReader.onerror = () => {
        reject(new Error('读取文件失败'));
      };

      function loadNextChunk() {
        const start = currentChunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, targetFile.size);
        fileReader.readAsArrayBuffer(targetFile.slice(start, end));
      }
      loadNextChunk();
    });
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14pt', fontWeight: 'bold', color: '#000', marginLeft: "10px" }}>媒资管理</span>
        <Button type="primary" onClick={showModal}>
          上传视频
        </Button>
        <Modal
          open={open}
          title="上传视频"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleAddFile}>添加文件</Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleUploadVideo}
            >
              上传视频
            </Button>,
          ]}
        >
          <Table dataSource={files} columns={fileColumns} rowKey="id" />
        </Modal>
      </div>
      <div>
        {/* 视频主表 */}
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
              fetchData(page, pageSize);
            },
          }}
        />
        <Modal
          open={previewModalOpen}
          title="预览视频"
          footer={[
            <Button key="close" onClick={() => { setPreviewModalOpen(false); setVideoUrl(''); }}>
              关闭
            </Button>
          ]}
          onCancel={() => { setPreviewModalOpen(false); setVideoUrl(''); }}
        >
          {/* 视频预览 */}
          {videoUrl && (
            <video
              key={videoUrl}
              controls
              style={{ width: 450, height: 500 }}
              preload="auto"
            >
              <source src={videoUrl} type='video/mp4' />
            </video>
          )}
        </Modal>
      </div>

    </>
  );
};
// 视频管理模块结束// 视频管理模块结束
// 视频管理模块结束// 视频管理模块结束



//课程管理模块开始//课程管理模块开始
//课程管理模块开始//课程管理模块开始
const Course: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [data, setData] = useState<DataType[]>([]);
  // 更新主列表
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0); // 存储总记录数
  interface DataType {
    email: string;       // 邮箱号
    filename: string;    // 课程信息（文件名字）
    fileType: string;    // 任务数（文件类型）
    tags: string;        // 报名人数
    createTime: string;  // 创建时间
    auditStatus: string; // 审核状态
    fileId: string;      // 文件 ID（操作时可能需要）
    grade: string;      // 年级,
    teachmode: string;  // 授课方式,
    description: string; // 课程描述,
    status: string;      // 发布状态
    auditStatuszw: string; // 审核状态
    statuszw: string;      // 发布状态
  }

  type DataIndex = keyof DataType;

  const fetchData = async (page: number, size: number) => {
    try {
      const response = await courseBaseInfoController.list({
        current: page,       // 使用传入的页码
        pageSize: size,      // 使用传入的每页条目数
      });
      console.log('课程更新主列表', response.data)
      const paginationInfo = {
        size: response.data.size || 0, // 确保 size 不为 undefined 或 null
        total: response.data.total || 0, // 确保 total 不为 undefined 或 null
      };
      setTotal(paginationInfo.total); // 设置总记录数
      // 格式化数据并填充表格
      const formattedData = response.data.records.map(item => {
        const createTime = new Date(item.createDate); // 假设 item.createTime 是一个有效的日期字符串或时间戳  
        // 格式化为 "YYYY-MM-DD HH:mm:ss" 格式  
        const formattedTime = `${createTime.getFullYear()}-${String(createTime.getMonth() + 1).padStart(2, '0')}-${String(createTime.getDate()).padStart(2, '0')} ${String(createTime.getHours()).padStart(2, '0')}:${String(createTime.getMinutes()).padStart(2, '0')}:${String(createTime.getSeconds()).padStart(2, '0')}`;
        // 审核状态中文描述
        let auditStatuszw = '';
        if (item.auditStatus === '202001') {
          auditStatuszw = '审核未通过';
        } else if (item.auditStatus === '202002') {
          auditStatuszw = '未提交';
        } else if (item.auditStatus === '202003') {
          auditStatuszw = '已提交';
        } else if (item.auditStatus === '202004') {  // 修改为正确的状态码
          auditStatuszw = '审核通过';
        }

        let statuszw = '';
        if (item.status === '203001') {
          statuszw = '未发布';
        } else if (item.status === '203002') {
          statuszw = '已发布';
        } else if (item.status === '203003') {
          statuszw = '下线';
        }
        return {
          filename: item.name,
          fileType: item.users,//人群
          tags: item.tags,
          grade: item.grade,
          teachmode: item.teachmode,
          description: item.description,
          createTime: formattedTime,
          auditStatus: item.auditStatus,
          auditStatuszw: auditStatuszw,
          status: item.status,
          statuszw: statuszw,
          fileId: item.id,
        };
      });
      setData(formattedData);
    } catch (error) {
      console.error('检查文件时出错:', error);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnsType<DataType>[number] => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            滤波器
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            关闭
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  // 课程信息列表的渲染（主表）
  const columns: TableColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'fileId',
      key: 'fileId',
      width: '5%',
      ...getColumnSearchProps('fileId'),
    },
    {
      title: '课程信息',
      dataIndex: 'filename',
      key: 'filename',
      width: '15%',
      ...getColumnSearchProps('filename'),
    },
    {
      title: '适用人群',
      dataIndex: 'fileType',
      key: 'fileType',
      width: '7%',
      ...getColumnSearchProps('fileType'),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '10%',
      ...getColumnSearchProps('createTime'),
    },
    {
      title: '课程标签',
      dataIndex: 'tags',
      key: 'tags',
      width: '8%',
      ...getColumnSearchProps('tags'),
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
      width: '10%',
      ...getColumnSearchProps('grade'),
    },
    {
      title: '授课方式',
      dataIndex: 'teachmode',
      key: 'teachmode',
      width: '8%',
      ...getColumnSearchProps('teachmode'),
    },
    {
      title: '课程描述',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      render: (text: string) => (
        <span title={text}>{text.length > 30 ? `${text.slice(0, 30)}...` : text}</span>
      ),
      // ...getColumnSearchProps('description'),
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatuszw',
      key: 'auditStatuszw',
      width: '7%',
      ...getColumnSearchProps('auditStatuszw'),
    },
    {
      title: '发布状态',
      dataIndex: 'statuszw',
      key: 'statuszw',
      width: '7%',
      ...getColumnSearchProps('statuszw'),
    },
    {
      title: '操作',
      key: 'action',
      width: '7%',
      align: 'center', // 这个属性可能不会生效，因为它是表格列的属性，而不是样式
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <Space size="middle">
            <Button type="link" onClick={() => handlePreviewButtonClic(record)}>预览</Button>
            <Button
              type="link"
              onClick={() => handlePublishButtonClick(record)}
              disabled={publishDisabledButtons[record.fileId]}
            >
              发布
            </Button>
            <Button type="link" onClick={() => handleEditButtonClick(record)}>编辑</Button>
          </Space>
          <Space size="middle" style={{ color: 'red' }}>
            <Button type="link" onClick={() => teachplanSubmit(record)}>
              教学计划
            </Button>
            <Button
              type="link"
              danger
              onClick={() => handleSubmitForReviewButtonClick(record)}
              disabled={disabledButtons[record.fileId]}
            >
              提交审核
            </Button>
            <Button type="link" danger onClick={() => handleRemoveButtonClick(record)}>移除</Button>
          </Space>
        </div>
      )
    }
    // ,
    //   // 添加自定义样式使表头文字居中
    //   headerStyle: {
    //     textAlign: 'center'
    //   }
  ];
  //教学计划
  const [jxfileId, setJxfileId] = useState<number>(0);
  const [courseName, setCourseName] = useState('');
  const teachplanSubmit = (record: DataType) => {
    // console.log('教学计划', record);
    setCourseName(record.filename)
    const fileId: string = record.fileId;
    const fileIdAsNumber: number = Number(fileId);
    setJxfileId(fileIdAsNumber);
    // console.log('教学计划id:', fileIdAsNumber);
    setTeachOpen(true)
    // setTeachOpen(true);
  };

  // 预览按钮的处理函数
  const [form3] = Form.useForm();
  const [PreviewCourseModalOpen, setPreviewCourseModalOpen] = useState(false);
  const [form3Visible, setForm3Visible] = useState(true);
  const [teachplans, setTeachplans] = useState([]); // 新增状态存储 teachplans 数据
  const [previewImageform3, setPreviewImageform3] = useState<string>('');
  const handlePreviewButtonClic = async (record: DataType) => {
    const PreviewId: string = record.fileId;
    const fileIdAsNumber: number = Number(PreviewId);
    setFileId(fileIdAsNumber);
    // console.log('预览id:', fileIdAsNumber);
    setPreviewCourseModalOpen(true);
    try {
      const response = await coursePublishController.preview(
        {
          courseId: fileIdAsNumber
          // ,
          // courseLearnRecordDto: { courseRecordId: 0 }
        });
      // console.log('预览111课程数据:', response);

      let auditStatuszww = '';
      if (response.data.courseBase.auditStatus === '202001') {
        auditStatuszww = '审核未通过';
      } else if (response.data.courseBase.auditStatus === '202002') {
        auditStatuszww = '未提交';
      } else if (response.data.courseBase.auditStatus === '202003') {
        auditStatuszww = '已提交';
      } else if (response.data.courseBase.auditStatus === '202004') {  // 修改为正确的状态码
        auditStatuszww = '审核通过';
      }

      let Statuszww = '';
      if (response.data.courseBase.status === '203001') {
        Statuszww = '未发布';
      } else if (response.data.courseBase.status === '203002') {
        Statuszww = '已发布';
      } else if (response.data.courseBase.status === '203003') {
        Statuszww = '下线';
      }

      form3.setFieldsValue({
        id: response.data.courseBase.id || '空',
        qq: response.data.courseBase.qq,
        wachat: response.data.courseBase.wachat || '空',
        phone: response.data.courseBase.phone || '空',
        label: JSON.parse(response.data.courseBase.label) || '空',
        auditStatus: auditStatuszww || '空',
        status: Statuszww || '空',
        name: response.data.courseBase.name || '空',
        tags: response.data.courseBase.tags || '空',
        originalPrice: response.data.courseBase.originalPrice || '空',
        teachmode: response.data.courseBase.teachmode || '空',
        charge: response.data.courseBase.charge || '空',
        // mt: response.data.courseBase.mt || '空',
        grade: response.data.courseBase.grade || '空',
        description: response.data.courseBase.description || '空',
        users: response.data.courseBase.users || '空',
        pic: response.data.courseBase.pic || '空',
        validDays: response.data.courseBase.validDays || '空',
        memberPrice: response.data.courseBase.memberPrice || '空',
        price: response.data.courseBase.price || '空',
      });
      // console.log('预览课程数据:', response.data);

      setPreviewImageform3(`http://192.168.101.132:9000${response.data.courseBase.pic}`);
      // console.log('预览课程数据:', response.data.teachplans[0].teachplanMedia);
      // 处理 teachplans 数据
      const plans = response.data.teachplans.map(plan => ({
        courseId: plan.courseId,
        coursePubId: plan.coursePubId,
        createTime: plan.createTime,
        description: plan.description,
        label: plan.label,
        mediaType: plan.mediaType,
        pname: plan.pname,
        teachplanMedia: plan.teachplanMedia.mediaFileName,
        teachplanId: plan.teachplanMedia.teachplanId,
      }));
      setTeachplans(plans); // 更新 teachplans 状态
      // console.log('66666', form3.getFieldsValue());
    } catch (error) {
      console.error('预览', error);
    }
  };


  // 实现发布功能的代码 
  const [publishDisabledButtons, setPublishDisabledButtons] = useState<{ [key: string]: boolean }>({});
  async function handlePublishButtonClick(record: DataType) {
    const SubmitId: string = record.fileId;
    const SubmitNumber: number = Number(SubmitId);
    // console.log('课程 ID:', SubmitNumber);
    // console.log('提交审核:', record);
    const status = record.status;
    const auditStatus = record.auditStatus;
    const firstThreeNumbers = status.slice(0, 3);
    // console.log('前三个数字:', firstThreeNumbers);
    try {
      // 调用获取字典数据接口
      const response = await dictionaryController.getByCode({ code: firstThreeNumbers });
      const itemValuesString = response.item_values;
      // console.log('发布', itemValuesString);

      if (itemValuesString) {
        const itemValuesArray = JSON.parse(itemValuesString);
        // console.log(itemValuesArray);

        // 根据当前状态判断按钮是否应该禁用
        const matchedStatus = itemValuesArray.find((item: { code: string }) => item.code === status);

        if (matchedStatus) {
          if ((auditStatus === '202004' && matchedStatus.desc === '未发布') || (auditStatus === '202004' && matchedStatus.desc === '已发布')
          ) {
            // if (matchedStatus.desc === '未发布') {
            try {
              const commitResponse = await coursePublishController.coursepublish({ courseId: SubmitNumber });
              // console.log('发布结果:', commitResponse);
              message.success('提交发布成功！');
            } catch (error) {
              message.error('提交审核失败，请重试！');
            }
            // message.success('发布成功！');
            setPublishDisabledButtons((prev) => ({ ...prev, [record.fileId]: false })); // 启用按钮
          } else if (matchedStatus.desc === '下线' || auditStatus === '202001' || auditStatus === '202002' || auditStatus === '202003') {
            // console.log('禁用发布按钮');
            if (matchedStatus.desc === '下线') {
              message.error('下线状态，无法发布！');
            } else if (auditStatus === '202001') {
              message.error('已处于审核未通过状态，无法发布！');
            } else if (auditStatus === '202002') {
              message.error('未提交状态，无法发布！');
            } else if (auditStatus === '202003') {
              message.error('已提交，即提交审核中的状态，无法发布！');
            }
            // message.error('未处于审核通过状态，无法发布！');
            setPublishDisabledButtons((prev) => ({ ...prev, [record.fileId]: true })); // 禁用按钮
          }
        }

      } else {
        console.error('item_values 为 undefined 或空值');
      }

    } catch (error) {
      message.error('课程发布失败，请重试！');
    }
  }

  // 实现编辑功能的代码  
  const [form2] = Form.useForm();
  const [editCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [fileId, setFileId] = useState<number>(0);
  const [previewImageform2, setPreviewImageform2] = useState<string>('');

  // console.log('编辑id:', fileId);
  async function handleEditButtonClick(record: DataType) {
    // console.log('编辑按钮点击:', record);
    const fileId: string = record.fileId;
    const fileIdAsNumber: number = Number(fileId);
    setFileId(fileIdAsNumber);
    // console.log('编辑id:', fileIdAsNumber);
    setEditCourseModalOpen(true);
    try {
      const response = await courseBaseInfoController.getCourseBaseById({ courseId: fileIdAsNumber });
      // console.log('获取的111课程数据:', response);
      form2.setFieldsValue({
        // managerId?: number;   
        // label: response.data.label,
        label: JSON.parse(response.data.label),
        phone: response.data.phone,
        wechat: response.data.wechat,
        qq: response.data.qq,
        name: response.data.name || 'null',
        tags: response.data.tags,
        price: response.data.price || '空',
        teachmode: response.data.teachmode,
        charge: response.data.charge,
        // mt: response.data.mt,
        grade: response.data.grade,
        description: response.data.description,
        users: response.data.users,
        pic: response.data.pic,
        validDays: response.data.validDays,
        memberPrice: response.data.memberPrice || 'null',
      });
      // console.log('8855', values);
      setPreviewImageform2(`http://192.168.101.132:9000${response.data.pic}`);
    } catch (error) {
      console.error('获取课程数据失败:', error);
    }
  }

  // 实现编辑功能的代码函数实现  
  const handleeditSubmit = async (values: any) => {
    // console.log('表单form2信息', values);
    const labelesJson = JSON.stringify(values.label);
    try {
      // 调用课程创建接口
      const response = await courseBaseInfoController.modifyCourseBase({
        id: fileId,
        ...values,
        label: labelesJson // 将请求数据转换为 JSON 字符串
      }
      );
      console.log('更新', response);
      setEditCourseModalOpen(false);
      form2.resetFields();
      message.success('表单更新成功！');
      setOpen(false);
    } catch (error) {
      message.error('表单更新提交失败，请重试！');
    }
  };

  // 实现提交审核功能的代码 
  const [disabledButtons, setDisabledButtons] = useState<{ [key: string]: boolean }>({});
  async function handleSubmitForReviewButtonClick(record: DataType) {
    const SubmitId: string = record.fileId;
    const SubmitNumber: number = Number(SubmitId);
    // console.log('课程 ID:', SubmitNumber);
    const status = record.status;
    const auditStatus = record.auditStatus;
    const firstThreeNumbers = auditStatus.slice(0, 3);
    // console.log('审核状态前缀:', firstThreeNumbers);
    try {
      // 调用获取字典数据接口
      const response = await dictionaryController.getByCode({ code: firstThreeNumbers });
      const itemValuesString = response.item_values;
      if (itemValuesString) {
        const itemValuesArray = JSON.parse(itemValuesString);
        // console.log('字典数据:', itemValuesArray);
        const matchedStatus = itemValuesArray.find((item: { code: string }) => item.code === auditStatus);
        if (matchedStatus) {
          // 检查当前状态以确定按钮行为
          if ((matchedStatus.desc === '审核未通过' || matchedStatus.desc === '未提交') && status === '203001') {
            try {
              const commitResponse = await coursePublishController.commitAudit({ courseId: SubmitNumber });
              // console.log('提交审核结果:', commitResponse。message);
              if (commitResponse.message.length === 0) {
                message.success('提交审核成功！');
              } else if (commitResponse.message.length !== 0) {
                message.error(commitResponse.message);
              }
            } catch (error) {
              // console.error('提交审核时出错:', error);
              message.error('提交审核失败，请重试！');
            }
            // 启用按钮
            setDisabledButtons((prev) => ({ ...prev, [record.fileId]: false }));
          } else if (matchedStatus.desc === '已提交' || matchedStatus.desc === '审核通过' || status === '203002' || status === '203003') {
            if (matchedStatus.desc === '已提交') {
              // console.log('课程已处于提交审核状态，无法再次提交！');
              message.error('课程已处于提交审核状态，无法提交！');
            } else if ((matchedStatus.desc === '审核通过' && status === '203002') || (matchedStatus.desc === '审核通过' && status === '203001')) {
              try {
                const commitResponse = await coursePublishController.commitAudit({ courseId: SubmitNumber });
                // console.log('提交审核结果:', commitResponse。message);
                if (commitResponse.message.length === 0) {
                  message.success('提交审核成功！');
                } else if (commitResponse.message.length !== 0) {
                  message.error(commitResponse.message);
                }
              } catch (error) {
                // console.error('提交审核时出错:', error);
                message.error('提交审核失败，请重试！');
              }
            } else if (status === '203002') {
              message.error('课程已发布，无法提交！');
            } else if (status === '203003') {
              message.error('课程下线，无法提交！');
            }
            // 禁用按钮
            // console.log('禁用提交审核按钮');
            setDisabledButtons((prev) => ({ ...prev, [record.fileId]: true }));
          }
        } else {
          // console.error('未找到匹配的审核状态');
          message.error('审核状态异常，请联系管理员！');
        }
      } else {
        // console.error('item_values 为 undefined 或空值');
        message.error('获取审核状态失败，请重试！');
      }
      // console.log('审核接口响应:', response);
    } catch (error) {
      // console.error('获取字典数据接口时出错:', error);
      message.error('课程提交审核失败，请重试！');
    }
  }

  // 移除按钮的处理函数
  const handleRemoveButtonClick = (record: DataType) => {
    console.log('移除:', record);
    // 在这里实现移除逻辑
  };


  // 添加课程
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // 确保使用 useForm 钩子
  const [picurl, setPicurl] = useState('');
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    if (form.isFieldsTouched()) {
      Modal.confirm({
        title: '确认取消',
        content: '是否要清空表单内容？',
        okText: '清空',
        cancelText: '保留',
        onOk: () => {
          form.resetFields();
          setOpen(false);
        },
        onCancel: () => {
          setOpen(false);
        },
      });
    } else {
      setOpen(false);
    }
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleSubmit = async (values: any) => {
    // console.log('表单信息', values);
    const labelsJson = JSON.stringify(values.label);
    try {
      // 调用课程创建接口
      const response = await courseBaseInfoController.createCourseBase(
        {
          ...values,
          label: labelsJson
        }
      );
      // console.log(response);
      message.success('表单提交成功！');
      // console.log(response);
      setOpen(false);
    } catch (error) {
      message.error('表单提交失败，请重试！');
    }
  };

  // form表单处理文件上传图片
  const handleFileUpload = async (file: any) => {
    // console.log('文件上传', file);
    const formData = new FormData();
    const courseName = form.getFieldValue('name');
    formData.append('objectName', courseName);
    formData.append('filedata', file);
    console.log('objectName', courseName);
    console.log('objectName', file);

    try {
      const uploadResponse = await mediaFilesController.upload(
        formData
      );
      console.log(uploadResponse);
      const { url } = uploadResponse.data; // 从响应中获取文件的 URL
      // console.log('文件上传成功，URL:', url);
      setPicurl(url)
      // 将 URL 设置为表单中的课程封面
      form.setFieldsValue({ pic: url });
      // form2.setFieldsValue({ pic: url });
      message.success('图片上传成功！'); // 图片上传成功提示
      // console.log('1表图片上传成功，URL:', url);

    } catch (error) {
      // console.error('文件上传失败:', error);
      message.error('图片上传失败，请重试！'); // 图片上传失败提示
    }
  };
  //form2的表单处理文件上传图片
  const handleFileform2Upload = async (file: any) => {
    // console.log('文件上传', file);
    const formData = new FormData();
    const courseName = form.getFieldValue('name');
    formData.append('objectName', courseName);
    formData.append('filedata', file);
    try {
      const uploadResponse = await mediaFilesController.upload(
        formData
      );
      // console.log(uploadResponse);
      const { url } = uploadResponse.data; // 从响应中获取文件的 URL
      // console.log('文件上传成功，URL:', url);
      setPicurl(url)
      // 将 URL 设置为表单中的课程封面
      form2.setFieldsValue({ pic: url });
      message.success('图片上传成功！'); // 图片上传成功提示
      // console.log('2表图片上传成功，URL:', url);
    } catch (error) {
      // console.error('文件上传失败:', error);
      message.error('图片上传失败，请重试！'); // 图片上传失败提示
    }
  };

  //预览图片
  const [previewOpen, setPreviewOpen] = useState(false); // 控制预览窗口是否打开
  const [previewImage, setPreviewImage] = useState(''); // 存储预览图片的 URL
  const [previewTitle, setPreviewTitle] = useState(''); // 预览图片的标题

  // 图片预览处理函数
  //   const previewOpenpic = async (file: UploadFile) => {
  //     // 如果 file 对象中有 URL，直接使用，否则使用文件的 base64 编码数据或其他方式生成预览
  //     console.log(form.getFieldValue('pic.url'));

  //     console.log('图片预览', file);
  //     const serverBaseUrl = 'http://192.168.101.132:9090'; // MinIO 服务器地址
  //     const previewUrl =  `${serverBaseUrl}${picurl}`
  //     // http://192.168.101.132:9090/mediafiles/2024/10/14/d3adcf0a9ca488adf5edd714490fb474.png
  //     // const previewUrl =  'http://192.168.101.132:9090/browser/mediafiles/2024/10/14/d3adcf0a9ca488adf5edd714490fb474.png'
  //     console.log('图片预览', previewUrl);

  // // console.log('图片预览', previewUrl);

  //     setPreviewImage(previewUrl); // 设置预览图片的 URL
  //     setPreviewOpen(true); // 打开预览窗口
  //     setPreviewTitle(file.name || previewUrl.substring(previewUrl.lastIndexOf('/') + 1)); // 设置预览图片的标题
  //   };

  //下面是使用文件的 base64 编码数据或其他方式生成预览
  const previewOpenpic = async (file: UploadFile) => {
    // console.log('图片预览', file);
    // 检查 file 对象中是否有 URL，如果没有则使用 FileReader 生成 base64 编码的预览
    if (file.url) {
      // 如果存在 URL，直接使用 URL 进行预览
      // src={`http://192.168.101.132:9000${file.url}`}
      // setPreviewImage(`http://192.168.101.132:9000${file.url}`);
    } else {
      // 使用 FileReader 将文件转换为 base64 格式
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as Blob);
      reader.onload = () => {
        // 当文件转换完成时，将 base64 数据设置为预览图片
        setPreviewImage(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error('生成图像预览时发生错误：', error);
      };
    }

    // 设置预览窗口的标题
    setPreviewTitle(file.name || '预览图片');
    setPreviewOpen(true); // 打开预览窗口
  };

  //教学计划部分
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teachOpen, setTeachOpen] = useState(false);
  const [twoteachOpen, setTwoteachOpen] = useState(false);
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };
  //外部
  const handleCancell = () => {
    setTeachOpen(false);
  };

  //内部
  const showTeachModal = () => {
    setTwoteachOpen(true);
  };

  const handTeachleOk = () => {
    setTwoteachOpen(false);
  };

  //添加教学计划按钮
  const [mediaType, setMediaType] = useState('');
  const [pname, setPname] = useState('');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState([]); // 更新为数组以支持多个标签
  const [refreshKey, setRefreshKey] = useState(0); // 新增状态，用于触发数据刷新
  // const randomFileId = uuidv4();
  // const fid: number = Math.floor(Math.random() * 1000000000);
  const handleAddTeaching = async () => {
    // console.log('添加教学计划', mediaType);
    // console.log('添加教学计划', pname);
    // console.log('视频列表计划', jxfileId);
    try {
      const response = await teachplanController.saveTeachplan({
        mediaType: mediaType, // 视频类型
        pname: pname, // 计划名称
        courseId: jxfileId,// 课程IDpname
        description: description,
        label: JSON.stringify(labels) // 将标签作为数组传递
        //     coursePubId?: number;
        // pname?: string;
        // description?: string;
        // mediaType?: string;
        // id?: number;
        // label?: string;
        // courseId?: number;
        // id: jxfileId, // 课程ID
        //  course_id?: number;
        // media_type?: string;
        // pname?: string;
        // id?: number;
        // course_pub_id?: number;
      });
      // console.log('添加教学计划', response);
      message.success('教学计划已成功保存！');
      setTwoteachOpen(false); // 关闭模态框
      setRefreshKey(prevKey => prevKey + 1); // 触发数据刷新
    } catch (error) {
      // console.error('保存教学计划时发生错误:', error);
      message.error('保存教学计划失败！');
    }

  };
  //课程标签
  const handleLabelChange = (value: React.SetStateAction<never[]>) => {
    setLabels(value); // 更新标签状态
  };
  interface CoursePlanItem {
    courseId: string;
    pname: string;
    mediaType: string;
    id: number;
  }

  const [coursePlanData, setCoursePlanData] = useState<CoursePlanItem[]>([]);
  useEffect(() => {
    setCoursePlanData([]); // 清空数据
    const fetchCoursePlans = async () => {
      try {
        const response = await teachplanController.getTreeNodes({
          courseId: jxfileId // ID
        });
        // console.log('获取111111111视频列表计划', jxfileId);
        // console.log('111视频列表计划', response.data);
        setCoursePlanData(response.data); // 将课程计划数据保存到 state 中
        message.success('视频列表计划已成功加载！');
      } catch (error) {
        // console.error('获取视频列表计划时发生错误:', error);
        message.error('加载视频列表计划失败！');
      }
    };
    fetchCoursePlans();
  }, [jxfileId, refreshKey]);
  const ContainerHeight = 400;

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
      // appendData();
    }
  };

  //绑定视频
  interface OneDataType {
    oneFilename: string; // 文件名字
    oneFileType: string; // 类型
    oneTags: string; // 标题
    oneCreateTime: string; // 上传时间
    // oneAuditStatus: string | null; // 审核状态
    oneFileId: string;
  }

  type OneDataIndex = keyof OneDataType;
  const [oneSearchText, setOneSearchText] = useState('');
  const [oneSearchedColumn, setOneSearchedColumn] = useState('');
  const oneSearchInput = useRef(null);
  const [oneData, setOneData] = useState<OneDataType[]>([]);
  const [oneCurrentPage, setOneCurrentPage] = useState(1);
  const [onePageSize, setOnePageSize] = useState(5);
  const [oneTotal, setOneTotal] = useState(0); // 存储总记录数

  const oneFetchData = async (page: number, size: number) => {
    try {
      const response = await bigFileController.listAiMasterDataByPage({
        current: page,
        pageSize: size,
      });
      // console.log('9999999', response);
      const paginationInfo = {
        current: response.data.current,
        pages: response.data.pages,
        size: response.data.size,
        total: response.data.total,
      };

      setOneTotal(paginationInfo.total); // 设置总记录数
      const formattedData = response.data.records.map((item) => {
        const oneCreateTime = new Date(item.createTime);
        const oneFormattedTime = `${oneCreateTime.getFullYear()}-${String(oneCreateTime.getMonth() + 1).padStart(2, '0')}-${String(oneCreateTime.getDate()).padStart(2, '0')} ${String(oneCreateTime.getHours()).padStart(2, '0')}:${String(oneCreateTime.getMinutes()).padStart(2, '0')}:${String(oneCreateTime.getSeconds()).padStart(2, '0')}`;

        return {
          oneFilename: item.filename,
          oneFileType: item.fileType,
          oneFileId: item.fileId,
          oneTags: item.tags,
          oneCreateTime: oneFormattedTime,
          // oneAuditStatus: item.auditStatus || '未审核',
        };
      });

      setOneData(formattedData);
    } catch (error) {
      console.error('检查文件时出错:', error);
    }
  };

  useEffect(() => {
    oneFetchData(oneCurrentPage, onePageSize);
  }, [oneCurrentPage, onePageSize]);

  const oneHandleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: OneDataIndex
  ) => {
    confirm();
    setOneSearchText(selectedKeys[0]);
    setOneSearchedColumn(dataIndex);
  };

  const oneHandleReset = (clearFilters: () => void) => {
    clearFilters();
    setOneSearchText('');
  };

  const oneGetColumnSearchProps = (dataIndex: OneDataIndex): any => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={oneSearchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => oneHandleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => oneHandleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button onClick={() => clearFilters && oneHandleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setOneSearchText((selectedKeys as string[])[0]);
              setOneSearchedColumn(dataIndex);
            }}
          >
            滤波器
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            关闭
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes((value as string).toLowerCase()),
    render: (text) => (oneSearchedColumn === dataIndex ? <Highlighter searchWords={[oneSearchText]} autoEscape textToHighlight={text ? text.toString() : ''} /> : text),
  });
  //绑定选择视频列表
  const oneColumns = [
    {
      title: '文件名字',
      dataIndex: 'oneFilename',
      key: 'oneFilename',
      ...oneGetColumnSearchProps('oneFilename'),
    },
    {
      title: '类型',
      dataIndex: 'oneFileType',
      key: 'oneFileType',
      ...oneGetColumnSearchProps('oneFileType'),
    },
    {
      title: '标题',
      dataIndex: 'oneTags',
      key: 'oneTags',
      ...oneGetColumnSearchProps('oneTags'),
    },
    {
      title: '上传时间',
      dataIndex: 'oneCreateTime',
      key: 'oneCreateTime',
      ...oneGetColumnSearchProps('oneCreateTime'),
    }
    // ,
    // {
    //   title: 'MD5',
    //   dataIndex: 'oneFileId',
    //   key: 'oneFileId',
    //   ...oneGetColumnSearchProps('oneFileId'),
    // },
  ];
 const [twomediaId, setTwomediaId] = useState('');
  const [twofileName, setTwofileName] = useState('');
  const [onevideoUrl, setOnevideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [oneteachOpen, setOneteachOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const handleAddVideo = (id: string) => {
    setSelectedItemId(id)
    setOneteachOpen(true);
  };
 
  const VideoTeaching = async (teachplanId: number) => {
    // console.log('视频列表计划', twofileName);
    // console.log('teachplanId', teachplanId);
    // console.log('mediaId', twomediaId);
    // const filesId = twomediaId; // 从record中提取fileId
    // const url = `http://localhost:63090/media/show?fileMd5=${filesId}`
    // setOnevideoUrl(url);
    // totalTime?: string;
    console.log('当前教学2',selectedItemId);
    
    try {
      const response = await teachplanController.associationMedia({
        fileName: twofileName,
        teachplanId: selectedItemId,
        mediaId: twomediaId,
        totalTime: videoDuration ? videoDuration.toString() : '',
      });
      message.success('视频成功加载！');
      // setVideoDuration(null); // 重置视频时长
      // console.log('视频列表计划xxxxx', response);
      // 假设 response.data 是包含多个课程计划的数组
      // setCoursePlanData(response.data); // 将课程计划数据保存到 state 中
      message.success('视频列表计划已成功加载！');
    } catch (error) {
      console.error('获取视频列表计划时发生错误:', error);
      message.error('加载视频列表计划失败！');
    }
  };

  const handleDelete = (courseId: string) => {
    setCoursePlanData(coursePlanData.filter(item => item.courseId !== courseId));
    message.success(`已删除课程计划: ${courseId}`);
  };

  const handleNextStep = () => {
    setForm3Visible(false); // 点击下一步后隐藏 form3
  };
  const [previewOpenf3, setPreviewOpenf3] = useState(false); // 控制 Modal 显示
  // const [previewImageform3, setPreviewImageform3] = useState(''); // 图片预览链接
  const [previewTitlef3, setPreviewTitlef3] = useState(''); // 预览标题

  // 点击图片预览
  const handlePreview = (file: any) => {
    setPreviewImageform3(file.url || file.preview); // 设置图片的预览链接
    // setPreviewTitle(file.name || file.url); // 设置预览的标题
    setPreviewOpen(true); // 打开 Modal
  };

  // 关闭 Modal
  const handleCancelf3 = () => setPreviewOpen(false);
  //课程编辑

  const [fileList, setFileList] = useState<any>([]); // 文件列表，存储已选择的图片
  const [isEditing, setIsEditing] = useState(false); // 控制是否是编辑状态

  // 初始图片链接（展示已有的图片）


  // 图片预览


  // 阻止默认上传行为，手动处理


  // 处理文件选择变化
  const handleChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      setPreviewImage(newFileList[0].url || newFileList[0].preview); // 更新预览图片
    }
  };
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14pt', fontWeight: 'bold', color: '#000', marginLeft: "10px" }}>课程管理</span>
        <Button type="primary" onClick={showModal}>
          添加课程
        </Button>
        <Modal
          open={open}
          title="添加课程"
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          {/* 添加课程 */}
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={handleSubmit}
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="qq号" name="qq" rules={[{ required: true, message: '请输入qq号' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="微信" name="wechat" rules={[{ required: true, message: '请输入微信号' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="课程名称" name="name" rules={[{ required: true, message: '请输入课程名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="默认会员价" name="memberPrice">
              <Input />
            </Form.Item>
            <Form.Item label="教育模式" name="teachmode" rules={[{ required: true, message: '请输入课程模式' }]}>
              <Select>
                <Select.Option value="线上">线上</Select.Option>
                <Select.Option value="线下">线下</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="是否收费" name="charge" rules={[{ required: true, message: '请选择是否收费' }]}>
              <Select>
                <Select.Option value="201001">付费</Select.Option>
                <Select.Option value="201000">免费</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="年级" name="grade" rules={[{ required: true, message: '请输入课程相应的年级' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="课程标签" name="tags">
              <Input />
            </Form.Item>
            <Form.Item label="标签" name="label">
              {/* <Input /> */}
              <Select
                mode="tags" // 设置为标签模式，允许用户输入自定义标签
                placeholder="输入标签并按 Enter 添加"
                value={labels}
                onChange={handleLabelChange} // 更新标签状态
                style={{ width: '100%', marginBottom: 16 }}
              >
              </Select>
            </Form.Item>
            <Form.Item label="有效天数" name="validDays" rules={[{ required: true, message: '请输入课程有效天数' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="适合人群" name="users" rules={[{ required: true, message: '请输入适合人群' }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="课程简介" name="description">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="课程封面" name="pic"
              valuePropName="fileList" getValueFromEvent={normFile}
            >
              <Upload
                listType="picture-card"
                onPreview={previewOpenpic} // 使用预览函数
                beforeUpload={handleFileUpload} // 阻止默认上传行为，改为手动处理上传
              >
                <button style={{ border: 0, background: 'none' }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>图片上传</div>
                </button>
              </Upload>
              <Modal
                visible={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                width={1000}
              >
                <img alt="图片预览" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
              fetchData(page, pageSize);
            },
          }}
        />
        <Modal
          open={editCourseModalOpen}
          title="编辑更新课程"
          width={600}
          footer={[
          ]}
          onCancel={() => { setEditCourseModalOpen(false); }}
        >
          {/* 编辑功能表单 */}
          <Form
            form={form2}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={handleeditSubmit}
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="qq号" name="qq" rules={[{ required: true, message: '请输入qq号' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="微信号" name="wechat" rules={[{ required: true, message: '请输入微信号' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="课程名称" name="name" rules={[{ required: true, message: '请输入课程名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="课程标签" name="tags">
              <Input />
            </Form.Item>
            <Form.Item label="标签" name="label">
              <Select
                mode="tags" // 设置为标签模式，允许用户输入自定义标签
                placeholder="输入标签并按 Enter 添加"
                value={labels}
                onChange={handleLabelChange} // 更新标签状态
                style={{ width: '100%', marginBottom: 16 }}
              >
              </Select>
            </Form.Item>
            {/* <Form.Item label="课程价格" name="price">
              <Input />
            </Form.Item> */}
            <Form.Item label="会员课程价格" name="memberPrice">
              <Input />
            </Form.Item>
            <Form.Item label="有效天数" name="validDays">
              <Input />
            </Form.Item>
            <Form.Item label="教育模式" name="teachmode" rules={[{ required: true, message: '请输入课程模式' }]}>
              <Select>
                <Select.Option value="线上">线上</Select.Option>
                <Select.Option value="线下">线下</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="是否收费" name="charge" rules={[{ required: true, message: '请选择是否收费' }]}>
              <Select>
                <Select.Option value="201001">付费</Select.Option>
                <Select.Option value="201000">免费</Select.Option>
              </Select>
            </Form.Item>
            {/* <Form.Item label="课程分类" name="mt" rules={[{ required: true, message: '请选择课程分类' }]}>
              <Select>
                <Select.Option value="语文">语文</Select.Option>
                <Select.Option value="数学">数学</Select.Option>
                <Select.Option value="英语">英语</Select.Option>
                <Select.Option value="物理">物理</Select.Option>
                <Select.Option value="生物">生物</Select.Option>
                <Select.Option value="化学">化学</Select.Option>
              </Select>
            </Form.Item> */}
            <Form.Item label="年级" name="grade" rules={[{ required: true, message: '输入' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="课程简介" name="description">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item label="适合人群" name="users" rules={[{ required: true, message: '请输入适合人群' }]}>
              <Input.TextArea rows={4} />
            </Form.Item>

            {/* <Form.Item label="课程封面" name="pic"
              valuePropName="fileList" getValueFromEvent={normFile}
            >
              <img alt="图片预览" style={{ width: '100%' }} src={previewImageform2} />
            </Form.Item> */}
            <Form.Item label="课程封面" name="pic"
              valuePropName="fileList" getValueFromEvent={normFile}
            >
              <Upload
                listType="picture-card"
                onPreview={previewOpenpic} // 使用预览函数
                beforeUpload={handleFileform2Upload} // 阻止默认上传行为，改为手动处理上传
              >
                <button style={{ border: 0, background: 'none' }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>图片上传</div>
                </button>
              </Upload>
              <Modal
                visible={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                width={1000}
              >
                <img alt="图片预览" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={PreviewCourseModalOpen}
          title="预览全部课程信息"
          footer={[]}
          width={600}
          onCancel={() => {
            setPreviewCourseModalOpen(false);
            setForm3Visible(true); // 取消时显示form3
            form3.resetFields(); // 清空表单
            setTeachplans([]); // 清空 teachplans 数据
          }}
        >
          {form3Visible ? (
            // 预览表
            <Form
              form={form3}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              onFinish={handleeditSubmit}
              style={{ maxWidth: 600 }}
            >
              <Form.Item label="课程ID" name="id" rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>

              {/* <Form.Item label="课程名称" name="name" rules={[{ required: true, message: '请输入课程名称' }]}>
                <Input className="custom-disabled-input" disabled />
              </Form.Item> */}
              <Form.Item label="qq号" name="qq" rules={[{ required: true, message: '请输入qq号' }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="微信号" name="wechat" rules={[{ required: true, message: '请输入微信号' }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="审核状态" name="auditStatus">
                <Input disabled />
              </Form.Item>
              <Form.Item label="发布状态" name="status">
                <Input disabled />
              </Form.Item>
              <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="标签" name="label">
                <Select
                  mode="tags"
                  placeholder="输入标签并按 Enter 添加"
                  value={labels}
                  onChange={handleLabelChange}
                  style={{ width: '100%', marginBottom: 16 }}
                  disabled
                >
                </Select>
              </Form.Item>
              <Form.Item label="课程名称" name="name" rules={[{ required: true, message: '请输入课程名称' }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label="课程标签" name="tags">
                <Input disabled />
              </Form.Item>
              <Form.Item label="课程价格" name="price">
                <Input disabled />
              </Form.Item>
              <Form.Item label="会员课程价格" name="memberPrice">
                <Input disabled />
              </Form.Item>
              <Form.Item label="课程的有效天数" name="validDays">
                <Input disabled />
              </Form.Item>
              <Form.Item label="教育模式" name="teachmode" rules={[{ required: true, message: '请输入课程模式' }]}>
                <Select disabled>
                  <Select.Option value="线上">线上</Select.Option>
                  <Select.Option value="线下">线下</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="是否收费" name="charge" rules={[{ required: true, message: '请选择是否收费' }]}>
                <Select disabled>
                  <Select.Option value="yes">是</Select.Option>
                  <Select.Option value="no">否</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="课程等级" name="grade" rules={[{ required: true, message: '请选择课程等级' }]}>
                <Select disabled>
                  <Select.Option value="A">A级</Select.Option>
                  <Select.Option value="B">B级</Select.Option>
                  <Select.Option value="C">C级</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="课程简介" name="description">
                <Input.TextArea rows={4} disabled />
              </Form.Item>
              <Form.Item label="适合人群" name="users" rules={[{ required: true, message: '请输入适合人群' }]}>
                <Input.TextArea rows={4} disabled />
              </Form.Item>

              <Form.Item label="课程封面" name="pic" valuePropName="fileList" getValueFromEvent={normFile}>
                <div style={{ position: 'relative' }}>
                  {/* 这里可以添加小眼睛图标按钮来放大图片 */}
                  <img
                    alt="图片预览"
                    style={{ width: '100%' }}
                    src={previewImageform3} // 使用 previewImageform3 来展示预览的图片
                  />
                  {previewImageform3 && (
                    <EyeOutlined
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '24px',
                        color: '#1890ff',
                        cursor: 'pointer',
                      }}
                      onClick={() => handlePreview({ url: previewImageform3 })} // 点击小眼睛图标触发放大
                    />
                  )}
                </div>

                {/* 弹出 Modal 放大图片 */}
                <Modal
                  visible={previewOpen}
                  // title={previewTitle}
                  footer={null}
                  onCancel={handleCancelf3}
                  width={1000}
                >
                  <img alt="图片预览" style={{ width: '100%' }} src={previewImageform3} />
                </Modal>
              </Form.Item>

              <Button type="primary" onClick={handleNextStep}>
                下一步
              </Button>
            </Form>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={teachplans} // 使用 teachplans 作为数据源
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta

                    title={<a >计划名称：{item.pname}</a>} // 显示 pname
                    description={`课程ID: ${item.courseId}, 课程发布ID: ${item.coursePubId}, 媒体类型: ${item.mediaType}, 媒体文件名: ${item.teachplanMedia}`} // 显示其他字段
                  />
                </List.Item>
              )}
            />
          )}
        </Modal>
        <Modal
          open={teachOpen}
          // onOk={handleOk}
          width={1000}
          onCancel={handleCancell}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginRight: 20, marginTop: 30 }}>
            <span style={{ fontSize: '14pt', fontWeight: 'bold', color: '#000', marginLeft: "10px" }}>教学计划</span>
            <Button type="primary"
              onClick={showTeachModal}
            >
              添加教学计划
            </Button>
            <Modal
              title="添加教学计划"
              open={twoteachOpen}
              onCancel={() => setTwoteachOpen(false)}

              footer={[
                <Button key="cancel" onClick={() => setTwoteachOpen(false)}>
                  取消
                </Button>,
                <Button key="submit" type="primary" onClick={handleAddTeaching}>
                  确认添加教学
                </Button>,
              ]}
            >
              <div>
                <Input
                  placeholder="计划名称"
                  value={pname}
                  onChange={(e) => setPname(e.target.value)}
                  style={{ width: '100%' }}
                />
                <Select
                  placeholder="选择视频类型"
                  value={mediaType.length < 0 ? mediaType : undefined}
                  onChange={setMediaType}
                  style={{ width: '100%', marginBottom: 16 }}
                >
                  <Option value="AVI">选择视频类型</Option>
                  <Option value="AVI">AVI</Option>
                  <Option value="MP4">MP4</Option>
                  <Option value="MOV">MOV</Option>
                  <Option value="WMV">WMV</Option>
                </Select>

                <Select
                  mode="tags" // 设置为标签模式，允许用户输入自定义标签
                  placeholder="输入标签并按 Enter 添加"
                  value={labels}
                  onChange={handleLabelChange} // 更新标签状态
                  style={{ width: '100%', marginBottom: 16 }}
                >
                </Select>
                <Input.TextArea rows={2}
                  placeholder="描述"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', marginBottom: 16 }}
                />
              </div>
            </Modal>
          </div>
          <div>
            <List>
              <VirtualList
                data={coursePlanData}
                height={ContainerHeight}
                itemHeight={47}
                itemKey="courseId"
                onScroll={onScroll}
              >
                {(item: CoursePlanItem) => (
                  <List.Item key={item.courseId}>
                    <List.Item.Meta
                      title={`计划名称: ${item.pname}`}
                      description={`课程ID: ${item.courseId} | 视频类型: ${item.mediaType}`}
                    />
                    <div style={{ marginRight: 20 }}>
                      <Button
                        type="link"
                        onClick={() => {
                          handleAddVideo(item.id);
                          console.log('当前点击1',item.id);
                          
                          // showTeachModal();
                        }}>
                        添加视频
                      </Button>

                      <Modal
                        title="添加视频"
                        open={oneteachOpen}
                        onCancel={() => setOneteachOpen(false)}
                        width={1000}
                        footer={[
                          <Button key="cancel" onClick={() => setOneteachOpen(false)}>
                            取消
                          </Button>,
                          <Button key="submit" type="primary" onClick={() => {VideoTeaching(item.id)
                            // console.log('当前点击2',item.id);
                          }
                            
                          }>
                            确认添加视频
                          </Button>,
                        ]}
                      >
                        <div>
                          <Cascader
                            style={{ width: '100%' }}
                            options={oneData.map((item) => ({
                              value: item.oneFileId,
                              label: item.oneFilename,
                            }))}
                            placeholder="选择视频"
                            onChange={(value, selectedOptions) => {
                              console.log('选中的值:', value, '选中的选项:', selectedOptions, setTwomediaId(value[0]), setTwofileName(selectedOptions[0].label))
                              // const filesId = value; // 从record中提取fileId
                              // const url = `http://localhost:63090/media/show?fileMd5=${filesId}`
                              // setOnevideoUrl(url);
                            }
                            }
                            onSearch={(value) => console.log(value)}
                          />
                          <Table
                            columns={oneColumns}
                            dataSource={oneData}
                            pagination={{
                              current: oneCurrentPage,
                              pageSize: onePageSize,
                              total: oneTotal,
                              onChange: (page, pageSize) => {
                                setOneCurrentPage(page);
                                setOnePageSize(pageSize);
                                oneFetchData(page, pageSize);
                              },
                            }}
                          />
                          {/* <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
                            <video
                              ref={videoRef}
                              key={onevideoUrl}
                              controls
                              style={{
                                width: '100%', // 宽度填充父容器
                                height: '100%', // 高度填充父容器
                                display: 'block', // 显示为块级元素
                                margin: '0 auto', // 居中对齐
                                // visibility: 'hidden', 
                              }}
                              preload="auto"
                              onLoadedMetadata={() => {
                                if (videoRef.current) {
                                  setVideoDuration(videoRef.current.duration);
                                  console.log('视频时长:', videoRef.current.duration);
                                }
                              }}
                            >
                              <source src={onevideoUrl} type='video/mp4' />
                              您的浏览器不支持 HTML5 视频。
                            </video>
                          </div> */}
                        </div>
                      </Modal>
                      <Button type="link" onClick={() => handleDelete(item.courseId)}>删除</Button>
                    </div>
                  </List.Item>
                )}
              </VirtualList>
            </List>
          </div>
        </Modal>
        {/* <img alt="图片预览" style={{ width: '100%' }}
         src='http://192.168.101.132:9090/mediafiles/2024/10/14/d3adcf0a9ca488adf5edd714490fb474.png' /> */}
      </div>
    </>
  );
}
//课程管理模块结束//课程管理模块结束
//课程管理模块结束//课程管理模块结束


//练习管理开始//练习管理开始//练习管理开始
const Exercise: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false); // 控制Modal的状态

  // 打开Modal
  const showModal = () => {
    setOpen(true);
  };

  // 关闭Modal
  const handleCancel = () => {
    setOpen(false);
  };

  // 异步上传文件
  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file); // 使用form-data传递Excel文件

      try {
        const result = await addAiMasterData(formData); // 发送包含Excel文件的请求
        console.log(result); // 处理获取到的数据
        message.success('文件上传成功');
      } catch (error) {
        console.error('上传文件时出错:', error);
        message.error('文件上传失败');
      }
    } else {
      message.warning('请选择要上传的文件');
    }
  };

  // 上传按钮的参数
  const uploadProps = {
    beforeUpload: (file: File) => {
      setFile(file); // 选中文件后存入状态
      return false;  // 阻止默认的自动上传行为
    },
    onRemove: () => {
      setFile(null); // 移除文件时清除状态
    },
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14pt', fontWeight: 'bold', color: '#000', marginLeft: "10px" }}>练习管理</span>
        <Button type="primary" onClick={showModal}>
          添加题目
        </Button>
      </div>

      <Modal
        open={open}
        title="添加题目"
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpload}>
            上传文件
          </Button>,
        ]}
        width={600}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖动文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个或批量上传。请勿上传公司数据或其他禁止文件。
          </p>
        </Dragger>
      </Modal>
      {/* <Table<DataType> columns={columns} dataSource={data} /> */}

    </>
  );
};
//练习管理结束//练习管理结束//练习管理结束

//用户开始//用户开始//用户开始
const User: React.FC = () => {
  const { Option } = Select;
  interface DataType {
    id: string;
    userAccount: string;
    userName: string;
    email: string;
    userRole: string;
    userAvatar?: string;
    createTime: string;
    updateTime: string;
    isPoint?: number;
    member?: string;
  }

  const memberDescriptions = {
    "605001": "会员",
    "605002": "超级会员",
    "605003": "普通用户",
  };
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [userDetails, setUserDetails] = useState<DataType | null>(null);
  const [mode, setMode] = useState<'add' | 'edit' | 'preview'>('add');
  const [data, setData] = useState<DataType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);

  const showModal = (mode: 'add' | 'edit' | 'preview') => {
    setMode(mode);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setUserDetails(null);
    setMode('add');
  };

  const handleUpload = async (values: any) => {
    try {
      if (mode === 'edit') {
        const aa = await userController.updateUser({ ...values, id: userDetails?.id, userProfile: "", member: userDetails?.member });
        message.success('用户更新成功');
        // console.log(aa);
      } else {
        await userController.addUser(values);
        message.success('用户添加成功');
      }
      handleCancel();
      fetchData(currentPage, pageSize);
    } catch (error) {
      message.error(mode === 'edit' ? '用户更新失败' : '用户添加失败');
    }
  };
  const fetchData = async (page: number, size: number) => {
    try {
      const response = await userController.listUserByPage({
        current: page,
        pageSize: size,
      });
      const formattedData = response.data.records.map((item: any) => ({
        id: item.id,
        userAccount: item.userAccount,
        userName: item.userName,
        email: item.email,
        userRole: item.userRole,
        userAvatar: item.userAvatar,
        createTime: new Date(item.createTime).toLocaleString(),
        updateTime: new Date(item.updateTime).toLocaleString(),
        isPoint: item.isPoint,
        member: item.member,
      }));
      setData(formattedData);
      setTotal(response.data.total);
    } catch (error) {
      console.error('获取用户数据时出错:', error);
    }
  };

  const handlePreview = async (record: DataType) => {
    const response = await userController.getUserById({ id: record.id });
    setUserDetails(response.data);
    form.setFieldsValue(response.data);
    showModal('preview');
  };

  const handleEdit = async (record: DataType) => {
    const response = await userController.getUserById({ id: record.id, member: record.member });
    setUserDetails(response.data);
    form.setFieldsValue(response.data);
    showModal('edit');
  };

  const handleRemove = async (id: string) => {
    try {
      await userController.deleteUser({ id });
      message.success('用户删除成功');
      fetchData(currentPage, pageSize);
    } catch (error) {
      message.error('用户删除失败');
    }
  };

  const columns = [
    { title: '用户账号', dataIndex: 'userAccount', key: 'userAccount' },
    { title: '用户昵称', dataIndex: 'userName', key: 'userName' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '角色', dataIndex: 'userRole', key: 'userRole' },
    {
      title: '用户类型',
      dataIndex: 'member',
      key: 'member',
      render: (text: keyof typeof memberDescriptions) => memberDescriptions[text] || text,
    },
    // {
    //   title: '管理员',
    //   dataIndex: 'isPoint',
    //   key: 'isPoint',
    //   render: () => {
    //     const isAdmin = userController.isAdmin(); // 调用方法获取是否为管理员
    //     console.log('xxx',isAdmin);

    //     return isAdmin ? '是' : '否'; // 根据返回值显示内容
    //   },
    // },
    { title: '积分', dataIndex: 'isPoint', key: 'isPoint' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DataType) => (
        <Space size="middle">
          <Button type="link" onClick={() => handlePreview(record)}>预览</Button>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleRemove(record.id)}>移除</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: '14pt', fontWeight: 'bold', color: '#000', marginLeft: '10px' }}>
          用户管理
        </span>
        <Button type="primary" onClick={() => showModal('add')}>
          添加用户
        </Button>
      </div>
      <Modal
        open={open}
        title={mode === 'edit' ? "更新用户" : mode === 'add' ? "添加用户" : "用户详情"}
        onCancel={handleCancel}
        footer={mode === 'preview' ? [
          <Button key="close" onClick={handleCancel}>
            关闭
          </Button>
        ] : [
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {mode === 'edit' ? "确认更新" : "确认添加"}
          </Button>,
        ]}
        width={600}
      >
        <Form
          form={form}
          name="userForm"
          onFinish={handleUpload}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="userAccount" label="用户账号" rules={[{ required: true }]}>
            <Input disabled={mode === 'preview'} />
          </Form.Item>
          <Form.Item name="userName" label="用户名" rules={[{ required: true }]}>
            <Input disabled={mode === 'preview'} />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: mode === 'add' }]}>
            <Input.Password disabled={mode === 'preview'} />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ type: 'email', required: true }]}>
            <Input disabled={mode === 'preview'} />
          </Form.Item>
          <Form.Item name="userRole" label="用户角色" rules={[{ required: true, message: '请选择用户角色' }]}>
            <Select placeholder="选择用户角色" disabled={mode === 'preview'}>
              <Option value="700001">USER</Option>
              <Option value="700002">ADMIN</Option>
              <Option value="700003">VIP</Option>
              <Option value="700004">TEACHER</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
      />
    </>
  );
};
//用户结束//用户结束//用户结束 

const VideoAIManager: React.FC = () => {
  const [currentContent, setCurrentContent] = useState<React.ReactNode>(<Video />);

  const items = [
    { key: 'Video', label: '视频管理' },
    { key: 'Course', label: '课程管理' },
    { key: 'Exercise', label: '练习管理' },
    { key: 'user', label: '用户管理' },
  ];

  const handleClick = (info: { key: string }) => {
    const key = info.key as string;
    switch (key) {
      case 'Video':
        setCurrentContent(<Video />);
        break;
      case 'Course':
        setCurrentContent(<Course />);
        break;
      case 'Exercise':
        setCurrentContent(<Exercise />);
        break;
      case 'user':
        setCurrentContent(<User />);
        break;
      default:
        setCurrentContent(<Video />);
        break;
    }
  };

  return (
    <Layout style={layoutStyle}>
      <Sider width="15%" style={siderStyle}>
        <Menu
          defaultSelectedKeys={['Video']}
          mode="inline"
          theme="dark"
          items={items}
          onClick={handleClick}
        />
      </Sider>
      <Content style={contentStyle}>
        {currentContent}
      </Content>
    </Layout>
  );
};

export default VideoAIManager;