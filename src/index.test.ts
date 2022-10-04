import {describe, expect, test} from '@jest/globals';
import client from './index'
import { daySchedule } from './types';

const token = "TOKEN HERE"

const api = new client(token)

test('expect schoolMessage to return something', async () => {
    const message = await api.schoolMessage()
    expect(message).toBe("No messages")
})

test('expect viewSchedule to return something', async () => {
    const schedule: daySchedule = await api.viewSchedule('2022-10-8')
    expect(schedule.periodDescription).toBeDefined()
})