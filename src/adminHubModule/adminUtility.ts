import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, FindOneOptions } from 'typeorm';

import {
  UpdateRequestDto,
  UpdateUserOrderDto,
} from 'src/productOrders/productOrderDto/productOrderDto';
import { OrderEntity } from 'src/productOrders/productOrderEntity/ordersEntity';
import { RequestEntity } from 'src/productOrders/productOrderEntity/requestEntity';
import { OrderRepository } from 'src/productOrders/productOrderRepository/ordersRepository';
import { RequestObject, UpdatedOrderObject } from 'src/types';

export const fetchRequests = async () => {
  const options: FindOneOptions<RequestEntity> = {};

  const requests: RequestObject[] = await RequestEntity.find(options);

  if (requests.length === 0) {
    throw new NotFoundException('requests not found');
  }

  return requests;
};

export const _fetchOrderWithId = async (
  orderId: string,
  entityManager: EntityManager,
): Promise<OrderEntity> => {
  try {
    const options: FindOneOptions<OrderEntity> = {
      where: { orderId },
    };
    const order = await entityManager.findOne(OrderEntity, options);

    if (!order) {
      throw new NotFoundException(`order with id ${orderId} not found`);
    }

    return order;
  } catch (error) {
    throw new InternalServerErrorException('failed to fetch order');
  }
};

export const updateOrder = async (
  orderId: string,
  updateOrderDto: UpdateUserOrderDto,
  entityManager: EntityManager,
): Promise<UpdatedOrderObject> => {
  const {
    orderName,
    category,
    imageUrl,
    quantity,
    price,
    content,
    deliveryDate,
    deliveryStatus,
  } = updateOrderDto;
  try {
    const order = await _fetchOrderWithId(orderId, entityManager);

    if (!order) {
      throw new NotFoundException('order not found');
    }

    order.orderName = orderName || order.orderName;
    order.category = category || order.category;
    order.imageUrl = imageUrl || order.imageUrl;
    order.quantity = quantity || order.quantity;
    order.price = price || order.price;
    order.content = content || order.content;
    order.deliveryDate = deliveryDate || order.deliveryDate;
    order.deliveryStatus = deliveryStatus || order.deliveryStatus;

    order.save();

    return {
      orderId: order.orderId,
      orderName: order.orderName,
      orderDate: order.orderDate,
      imageUrl: order.imageUrl,
      quantity: order.quantity,
      price: order.price,
      content: order.content,
      deliveryDate: order.deliveryDate,
      deliveryStatus: order.deliveryStatus,
    };
  } catch (error) {
    throw new InternalServerErrorException('failed to update order');
  }
};

const fetchRequestWithId = async (
  requestId: string,
  entityManager: EntityManager,
): Promise<RequestEntity> => {
  try {
    const options: FindOneOptions<RequestEntity> = {
      where: { requestId },
    };
    const request = await entityManager.findOne(RequestEntity, options);

    if (!request) {
      throw new NotFoundException(`request with id ${requestId} not found`);
    }

    return request;
  } catch (error) {
    throw new InternalServerErrorException('failed to fetch order');
  }
};

export const updateUserRequest = async (
  requestId: string,
  entityManager: EntityManager,
  updateRequestDto: UpdateRequestDto,
): Promise<RequestObject> => {
  const {
    requestTitle,
    orderType,
    category,
    content,
    quantity,
    price,
    imageUrl,
    deliveryDate,
    status,
  } = updateRequestDto;

  try {
    const request = await fetchRequestWithId(requestId, entityManager);

    if (!request) {
      throw new NotFoundException(
        `failed to find request with id ${requestId}`,
      );
    }

    request.requestTitle = requestTitle || request.requestTitle;
    request.orderType = orderType || request.orderType;
    request.category = category || request.category;
    request.content = content || request.content;
    request.quantity = quantity || request.quantity;
    request.price = price || request.price;
    request.imageUrl = imageUrl || request.imageUrl;
    request.deliveryDate = deliveryDate || request.deliveryDate;
    request.status = status || request.status;

    request.save();
    return request;
  } catch (error) {
    throw new InternalServerErrorException(
      `failed to update order with id ${requestId}`,
    );
  }
};
