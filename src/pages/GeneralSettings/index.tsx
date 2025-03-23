import Access from '@/components/Share/Access'
import { ALL_PERMISSIONS } from '@/constants/permissions'
import { Card } from 'antd'

const GeneralSettingPage = () => {
    return (
        <Access
            permission={ALL_PERMISSIONS.SETTINGS.GET}
        >
            <div className="container">
                <Card>

                </Card>
            </div>
        </Access>
    )
}

export default GeneralSettingPage