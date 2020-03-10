#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PersonalizePocStack } from '../lib/personalize_poc-stack';

const app = new cdk.App();
new PersonalizePocStack(app, 'PersonalizePocStack');
