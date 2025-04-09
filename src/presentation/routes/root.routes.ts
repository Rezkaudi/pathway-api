
import { Router } from 'express';

import { RootController } from '../controllers/root.controllers';

const rootRoute = (rootController: RootController): Router => {
    const router = Router()

    router.post("/", rootController.htmlHomePage.bind(rootController))
    return router;
};

export default rootRoute
