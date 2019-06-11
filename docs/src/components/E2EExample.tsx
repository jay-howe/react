import * as React from 'react'
import { Routes as BrowserTestRoutes } from '../../../e2e'
import { RouteComponentProps } from 'react-router'

type E2EProps = RouteComponentProps<{ exampleName: string }>

const E2EExample: React.FC<E2EProps> = ({ match }) =>
  React.createElement(BrowserTestRoutes[match.params.exampleName])

export default E2EExample