import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";
import {
  ConfigProvider,
  Table,
  List,
  DatePicker,
  Popconfirm,
  Button
} from "antd";
import "antd/dist/antd.css";

import trTR from "antd/lib/locale/tr_TR";
import enGB from "antd/lib/locale/en_GB";

import moment from "moment";
import "moment/dist/locale/tr";

import useAPI from "./fetch";

export default function App() {
  const [pageSize, setPageSize] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [lang, setLang] = useState(moment.locale());

  const getUsers = useAPI(
    "getUsers",
    {
      params: {
        page: currentPage,
        per_page: pageSize,
        delay: 4
      }
    },
    {
      enabled: false
    }
  );

  const createUser = useAPI("createUser");
  const updateUser = useAPI("updateUser");
  const deleteUser = useAPI("deleteUser");

  const columns = [
    ...["avatar", "first_name", "last_name", "email"].map((c) => ({
      dataIndex: c,
      title: c,
      render: (r) =>
        c === "avatar" ? (
          <img
            style={{ borderRadius: "50%" }}
            width={60}
            alt="avatar"
            src={r}
          />
        ) : (
          r
        )
    })),
    {
      key: "actions",
      title: "",
      render: (r) => (
        <>
          <Button
            type="primary"
            onClick={() =>
              updateUser.mutate({
                data: { name: "foo", job: "bar" },
                pathParam: r.id
              })
            }
          >
            Update
          </Button>
          <Popconfirm
            title="Are You Sure?"
            onConfirm={() =>
              deleteUser.mutate({
                pathParam: r.id
              })
            }
          >
            <Button danger type="primary">
              Delete
            </Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <ConfigProvider locale={lang === "en" ? enGB : trTR}>
      <div className="frame">
        <h1>Hello StackBlitz!</h1>
        <p>Start editing to see some magic happen :)</p>

        <Button onClick={() => getUsers.refetch()}>Get Users</Button>
        <Button
          onClick={() =>
            createUser.mutate({ data: { name: "bob", job: "homeless" } })
          }
        >
          Create User
        </Button>

        {/* <List dataSource={Object.entries(thing)} renderItem={(r) => "sdfgds"} /> */}

        <Table
          loading={getUsers.isFetching}
          dataSource={
            getUsers.data?.data?.map((i) => ({ ...i, key: i.id })) || []
          }
          columns={columns}
          size="small"
          bordered={false}
          pagination={{
            showTotal: (r) => getUsers.data.total,
            current: currentPage,
            pageSize: pageSize,
            pageSizeOptions: [2, 5, 10],
            showSizeChanger: true,
            onShowSizeChange: (curr, size) => {
              setPageSize(size);
              setCurrentPage(curr);
              getUsers.refetch();
            }
          }}
        />
      </div>
    </ConfigProvider>
  );
}
