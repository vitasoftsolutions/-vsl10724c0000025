import { Card, Divider, Form, Skeleton, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { productImage } from "../../../assets/data/productImage";
import { useGetBrandsQuery } from "../../../redux/services/brand/brandApi";
import CustomCheckbox from "../../Shared/Checkbox/CustomCheckbox";
import CustomForm from "../../Shared/Form/CustomForm";

const { Meta } = Card;

export const Brands = ({ handleSubmit, onClose }) => {
  const [brandForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    allData: 1,
  });
  const { data, isLoading } = useGetBrandsQuery({
    params: pagination,
  });

  const [newData, setNewData] = useState([]);

  const brands = data?.results?.brand;
  const total = data?.meta?.total;

  const loadMoreData = useCallback(() => {
    if (newData.length < total) {
      setPagination((prevPagination) => ({
        ...prevPagination,
        page: prevPagination.page + 1,
      }));
    }
  }, [newData.length, total]);

  useEffect(() => {
    if (brands && brands.length) {
      // setNewData((prevData) => [...prevData, ...brands]);
      setNewData((prevData) => {
        const uniqueData = new Set([...prevData, ...brands]);
        return Array.from(uniqueData);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brands]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-lg mt-4">
          <Spin />
        </div>
      </div>
    );
  }

  return (
    <div
      id="scrollableDiv"
      style={{
        height: "90vh",
        overflow: "auto",
        padding: "0 16px",
      }}
    >
      <InfiniteScroll
        dataLength={newData?.length}
        next={newData?.length < total && loadMoreData}
        hasMore={newData?.length < total}
        loader={
          <Skeleton
            className="my-4"
            paragraph={{
              rows: 3,
            }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <>
          <CustomForm
            form={brandForm}
            handleSubmit={handleSubmit}
            onClose={onClose}
          >
            {/* <CustomCheckbox mode="group"></CustomCheckbox> */}
            <div className="grid grid-cols-4 gap-4 overflow-x-hidden">
              {brands &&
                newData?.map((item) => (
                  <CustomCheckbox
                    name={item.id}
                    key={item.id}
                    label={
                      <Card
                        bordered
                        hoverable
                        style={{
                          backgroundColor: "white",
                          width: 160,
                        }}
                        className="shadow-md border "
                        cover={
                          <img
                            alt="example"
                            className="h-[6rem] object-cover px-4 pt-4"
                            src={productImage}
                          />
                        }
                      >
                        <Meta className="text-center" title={item.name} />
                      </Card>
                    }
                  />
                ))}
            </div>
          </CustomForm>
          {newData?.length < total && (
            <div className="text-center my-4 pb-10">
              Pull down to load more ....
            </div>
          )}
        </>
      </InfiniteScroll>
    </div>
  );
};
